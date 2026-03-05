using HeatSphere.Domain.Entities;
using HeatSphere.Domain.Interfaces;
using HeatSphere.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ↓ CORS corrigido: inclui produção
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "https://heatsphere.guilhermedoprado.com")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// 1º — ForwardedHeaders (deve ser o primeiro middleware)
var fwdOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor
                     | ForwardedHeaders.XForwardedProto
                     | ForwardedHeaders.XForwardedHost
};
fwdOptions.KnownIPNetworks.Clear();
fwdOptions.KnownProxies.Clear();
app.UseForwardedHeaders(fwdOptions);

// 2º — CORS
app.UseCors("Frontend");

// 3º — Swagger
app.UseSwagger();
app.UseSwaggerUI();

// 4º — Migrations (antes de mapear rotas)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

// Rotas
var notes       = app.MapGroup("/api/notes");
var productivity = app.MapGroup("/api/productivity");

// ------------------------------------------
// NOTES
// ------------------------------------------

notes.MapGet("/", async (INoteRepository repo, CancellationToken ct) =>
    TypedResults.Ok(await repo.GetAllAsync(ct)));

notes.MapGet("/{id:guid}", async Task<Results<Ok<Note>, NotFound>> (
    Guid id, INoteRepository repo, CancellationToken ct) =>
    await repo.GetByIdAsync(id, ct) is { } note
        ? TypedResults.Ok(note)
        : TypedResults.NotFound());

notes.MapPost("/", async (Note note, INoteRepository repo, CancellationToken ct) =>
{
    await repo.AddAsync(note, ct);
    await repo.SaveChangesAsync(ct);
    return TypedResults.Created($"/api/notes/{note.Id}", note);
});

notes.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound>> (
    Guid id, Note updated, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();

    existing.Title          = updated.Title;
    existing.Subject        = updated.Subject;
    existing.ContentMarkdown = updated.ContentMarkdown;
    existing.BriefDefinition = updated.BriefDefinition;
    existing.SortOrder      = updated.SortOrder;
    existing.Tags           = updated.Tags;
    existing.UpdatedAt      = DateTime.UtcNow;

    repo.Update(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound>> (
    Guid id, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();

    repo.Delete(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// ------------------------------------------
// NOTES — FOLDER OPERATIONS
// ------------------------------------------

notes.MapDelete("/folder", async Task<Results<NoContent, NotFound, BadRequest<string>>> (
    [FromQuery] string folderPath, INoteRepository repo, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(folderPath))
        return TypedResults.BadRequest("Folder path required");

    var toDelete = (await repo.GetAllAsync(ct))
        .Where(n => n.Subject == folderPath || n.Subject?.StartsWith(folderPath + "/") == true)
        .ToList();

    if (!toDelete.Any()) return TypedResults.NotFound();

    foreach (var note in toDelete) repo.Delete(note);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapPut("/folder/rename", async Task<Results<NoContent, BadRequest<string>>> (
    [FromQuery] string oldPath, [FromQuery] string newPath,
    INoteRepository repo, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(oldPath) || string.IsNullOrWhiteSpace(newPath))
        return TypedResults.BadRequest("Paths required");

    var toUpdate = (await repo.GetAllAsync(ct))
        .Where(n => n.Subject == oldPath || n.Subject?.StartsWith(oldPath + "/") == true)
        .ToList();

    foreach (var note in toUpdate)
    {
        note.Subject = note.Subject == oldPath
            ? newPath
            : newPath + note.Subject!.Substring(oldPath.Length);
        note.UpdatedAt = DateTime.UtcNow;
        repo.Update(note);
    }

    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// ------------------------------------------
// PRODUCTIVITY — POMODORO
// ------------------------------------------

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

public record WorkSessionDto(string TaskName, int DurationSeconds);
