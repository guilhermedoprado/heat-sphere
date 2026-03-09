using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using HeatSphere.Domain.Entities;
using HeatSphere.Domain.Interfaces;
using HeatSphere.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtSecret = builder.Configuration["Auth:Jwt:Secret"]
    ?? throw new InvalidOperationException("Auth:Jwt:Secret não configurado.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Auth:Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Auth:Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor
                     | ForwardedHeaders.XForwardedProto
                     | ForwardedHeaders.XForwardedHost,
    KnownIPNetworks  = { },
    KnownProxies     = { }
});

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

// ------------------------------------------
// AUTH
// ------------------------------------------

app.MapPost("/api/auth/google", async (
    GoogleAuthDto dto,
    IUserRepository userRepo,
    IConfiguration config,
    ILogger<Program> logger) =>
{
    GoogleJsonWebSignature.Payload payload;
    try
    {
        payload = await GoogleJsonWebSignature.ValidateAsync(
            dto.IdToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [config["Auth:Google:ClientId"]]
            });
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Google token validation failed");
        return Results.Unauthorized();
    }

    try
    {
        var user = await userRepo.GetByGoogleIdAsync(payload.Subject);
        if (user is null)
        {
            user = new User
            {
                GoogleId   = payload.Subject,
                Email      = payload.Email,
                Name       = payload.Name,
                PictureUrl = payload.Picture
            };
            await userRepo.AddAsync(user);
            await userRepo.SaveChangesAsync();
        }

        var token = GenerateJwt(user, config);

        return Results.Ok(new
        {
            AccessToken = token,
            User        = new { user.Id, user.Name, user.Email, user.PictureUrl }
        });
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Auth endpoint failed after token validation");
        return Results.Problem(detail: ex.Message, statusCode: 500);
    }
}).AllowAnonymous();

// ------------------------------------------
// NOTES  (requer autenticação)
// ------------------------------------------

var notes = app.MapGroup("/api/notes").RequireAuthorization();

notes.MapGet("/", async (HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    var userId = GetCurrentUserId(ctx);
    return TypedResults.Ok(await repo.GetByUserIdAsync(userId, ct));
});

notes.MapGet("/{id:guid}", async Task<Results<Ok<Note>, NotFound, ForbidHttpResult>> (
    Guid id, HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    var note = await repo.GetByIdAsync(id, ct);
    if (note is null) return TypedResults.NotFound();
    if (note.UserId != GetCurrentUserId(ctx)) return TypedResults.Forbid();
    return TypedResults.Ok(note);
});

notes.MapPost("/", async (Note note, HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    note.UserId = GetCurrentUserId(ctx);
    await repo.AddAsync(note, ct);
    await repo.SaveChangesAsync(ct);
    return TypedResults.Created($"/api/notes/{note.Id}", note);
});

notes.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound, ForbidHttpResult>> (
    Guid id, Note updated, HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();
    if (existing.UserId != GetCurrentUserId(ctx)) return TypedResults.Forbid();

    existing.Title            = updated.Title;
    existing.Subject          = updated.Subject;
    existing.ContentMarkdown  = updated.ContentMarkdown;
    existing.BriefDefinition  = updated.BriefDefinition;
    existing.SortOrder        = updated.SortOrder;
    existing.Tags             = updated.Tags;
    existing.UpdatedAt        = DateTime.UtcNow;

    repo.Update(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound, ForbidHttpResult>> (
    Guid id, HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();
    if (existing.UserId != GetCurrentUserId(ctx)) return TypedResults.Forbid();

    repo.Delete(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapDelete("/folder", async Task<Results<NoContent, NotFound, BadRequest<string>>> (
    [FromQuery] string folderPath, HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(folderPath))
        return TypedResults.BadRequest("Folder path required");

    var userId  = GetCurrentUserId(ctx);
    var toDelete = (await repo.GetByUserIdAsync(userId, ct))
        .Where(n => n.Subject == folderPath || n.Subject.StartsWith(folderPath + "/"))
        .ToList();

    if (!toDelete.Any()) return TypedResults.NotFound();

    foreach (var note in toDelete) repo.Delete(note);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapPut("/folder/rename", async Task<Results<NoContent, BadRequest<string>>> (
    [FromQuery] string oldPath, [FromQuery] string newPath,
    HttpContext ctx, INoteRepository repo, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(oldPath) || string.IsNullOrWhiteSpace(newPath))
        return TypedResults.BadRequest("Paths required");

    var userId   = GetCurrentUserId(ctx);
    var toUpdate = (await repo.GetByUserIdAsync(userId, ct))
        .Where(n => n.Subject == oldPath || n.Subject.StartsWith(oldPath + "/"))
        .ToList();

    foreach (var note in toUpdate)
    {
        note.Subject   = note.Subject == oldPath
            ? newPath
            : newPath + note.Subject[oldPath.Length..];
        note.UpdatedAt = DateTime.UtcNow;
        repo.Update(note);
    }

    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// ------------------------------------------
// PRODUCTIVITY — POMODORO
// ------------------------------------------

var productivity = app.MapGroup("/api/productivity");

productivity.MapGet("/stats", async (AppDbContext db, CancellationToken ct) =>
{
    var stats = await db.WorkSessions
        .GroupBy(w => w.TaskName)
        .Select(g => new {
            TaskName     = g.Key,
            TotalSeconds = g.Sum(w => w.DurationSeconds)
        })
        .OrderByDescending(x => x.TotalSeconds)
        .ToListAsync(ct);

    return TypedResults.Ok(new {
        Tasks        = stats,
        TotalOverall = stats.Sum(s => s.TotalSeconds)
    });
});

productivity.MapPost("/session", async Task<Results<Ok, BadRequest<string>>> (
    [FromBody] WorkSessionDto dto, AppDbContext db, CancellationToken ct) =>
{
    if (dto.DurationSeconds <= 0 || string.IsNullOrWhiteSpace(dto.TaskName))
        return TypedResults.BadRequest("Invalid session data");

    db.WorkSessions.Add(new WorkSession {
        TaskName        = dto.TaskName,
        DurationSeconds = dto.DurationSeconds,
        CreatedAt       = DateTime.UtcNow
    });
    await db.SaveChangesAsync(ct);
    return TypedResults.Ok();
});

app.Run();

// ------------------------------------------
// Helpers
// ------------------------------------------

static Guid GetCurrentUserId(HttpContext ctx)
    => Guid.Parse(ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

static string GenerateJwt(User user, IConfiguration config)
{
    var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Auth:Jwt:Secret"]!));
    var creds   = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expires = DateTime.UtcNow.AddDays(int.Parse(config["Auth:Jwt:ExpiresInDays"] ?? "30"));

    var token = new JwtSecurityToken(
        issuer:             config["Auth:Jwt:Issuer"],
        audience:           config["Auth:Jwt:Audience"],
        claims:
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        ],
        expires:            expires,
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// ------------------------------------------
// DTOs
// ------------------------------------------

public record GoogleAuthDto(string IdToken);
public record WorkSessionDto(string TaskName, int DurationSeconds);
