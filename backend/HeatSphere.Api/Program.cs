
using HeatSphere.Domain.Entities;
using HeatSphere.Domain.Interfaces;
using HeatSphere.Infrastructure;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

const string corsPolicy = "FrontendDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

var forwarded = new ForwardedHeadersOptions
{
  ForwardedHeaders = ForwardedHeaders.XForwardedFor
                   | ForwardedHeaders.XForwardedProto
                   | ForwardedHeaders.XForwardedHost
};

forwarded.KnownNetworks.Clear();
forwarded.KnownProxies.Clear();
app.UseForwardedHeaders(forwarded);

app.UseCors(corsPolicy);

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

var api = app.MapGroup("/api");
var notes = api.MapGroup("/notes");
var productivity = api.MapGroup("/productivity");

// ------------------------------------------
// ENDPOINTS PADRÕES DE NOTAS
// ------------------------------------------

notes.MapGet("/", async (INoteRepository repo, CancellationToken ct) =>
    TypedResults.Ok(await repo.GetAllAsync(ct)));

notes.MapGet("/{id:guid}", async Task<Results<Ok<Note>, NotFound>> (Guid id, INoteRepository repo, CancellationToken ct) =>
    await repo.GetByIdAsync(id, ct) is { } note
        ? TypedResults.Ok(note)
        : TypedResults.NotFound());

notes.MapPost("/", async (Note note, INoteRepository repo, CancellationToken ct) =>
{
    await repo.AddAsync(note, ct);
    await repo.SaveChangesAsync(ct);
    return TypedResults.Created($"/api/notes/{note.Id}", note);
});

notes.MapPut("/{id:guid}", async Task<Results<NoContent, NotFound>> (Guid id, Note updated, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();

    existing.Title = updated.Title;
    existing.Subject = updated.Subject;
    existing.ContentMarkdown = updated.ContentMarkdown;
    existing.BriefDefinition = updated.BriefDefinition;
    existing.SortOrder = updated.SortOrder;
    existing.Tags = updated.Tags;
    existing.UpdatedAt = DateTime.UtcNow;

    repo.Update(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

notes.MapDelete("/{id:guid}", async Task<Results<NoContent, NotFound>> (Guid id, INoteRepository repo, CancellationToken ct) =>
{
    var existing = await repo.GetByIdAsync(id, ct);
    if (existing is null) return TypedResults.NotFound();

    repo.Delete(existing);
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// ------------------------------------------
// NOVOS ENDPOINTS DE PASTAS (BATCH OPERATIONS)
// ------------------------------------------

// DELETE: api/notes/folder?folderPath=...
notes.MapDelete("/folder", async Task<Results<NoContent, NotFound, BadRequest<string>>> (
    [FromQuery] string folderPath, 
    INoteRepository repo, 
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(folderPath)) return TypedResults.BadRequest("Folder path required");

    var allNotes = await repo.GetAllAsync(ct);
    var notesToDelete = allNotes.Where(n => n.Subject == folderPath || n.Subject?.StartsWith(folderPath + "/") == true).ToList();

    if (!notesToDelete.Any()) return TypedResults.NotFound();

    foreach(var note in notesToDelete)
    {
        repo.Delete(note);
    }
    
    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// PUT: api/notes/folder/rename?oldPath=...&newPath=...
notes.MapPut("/folder/rename", async Task<Results<NoContent, BadRequest<string>>> (
    [FromQuery] string oldPath, 
    [FromQuery] string newPath, 
    INoteRepository repo, 
    CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(oldPath) || string.IsNullOrWhiteSpace(newPath)) 
        return TypedResults.BadRequest("Paths required");

    var allNotes = await repo.GetAllAsync(ct);
    var notesToUpdate = allNotes.Where(n => n.Subject == oldPath || n.Subject?.StartsWith(oldPath + "/") == true).ToList();

    foreach (var note in notesToUpdate)
    {
        if (note.Subject == oldPath)
        {
            note.Subject = newPath;
        }
        else if (note.Subject != null && note.Subject.StartsWith(oldPath + "/"))
        {
            // Substitui "OldFolder/SubFolder" por "NewFolder/SubFolder"
            note.Subject = newPath + note.Subject.Substring(oldPath.Length);
        }
        
        note.UpdatedAt = DateTime.UtcNow;
        repo.Update(note);
    }

    await repo.SaveChangesAsync(ct);
    return TypedResults.NoContent();
});

// ------------------------------------------
// ENDPOINTS DE PRODUTIVIDADE (POMODORO)
// ------------------------------------------

// GET: Retorna o Dashboard de estatísticas
productivity.MapGet("/stats", async (AppDbContext db, CancellationToken ct) =>
{
    // Agrupa por tarefa e soma os segundos de todas as sessões salvas
    var stats = await db.WorkSessions
        .GroupBy(w => w.TaskName)
        .Select(g => new {
            TaskName = g.Key,
            TotalSeconds = g.Sum(w => w.DurationSeconds)
        })
        .OrderByDescending(x => x.TotalSeconds)
        .ToListAsync(ct);

    var totalOverall = stats.Sum(s => s.TotalSeconds);

    return TypedResults.Ok(new {
        Tasks = stats,
        TotalOverall = totalOverall
    });
});

// POST: Salva uma sessão (seja ela completa de 25m ou parcial)
productivity.MapPost("/session", async Task<Results<Ok, BadRequest<string>>> (
    [FromBody] WorkSessionDto dto, 
    AppDbContext db, 
    CancellationToken ct) =>
{
    if(dto.DurationSeconds <= 0 || string.IsNullOrWhiteSpace(dto.TaskName)) 
        return TypedResults.BadRequest("Invalid session data");

    var session = new WorkSession
    {
        TaskName = dto.TaskName,
        DurationSeconds = dto.DurationSeconds,
        CreatedAt = DateTime.UtcNow
    };

    db.WorkSessions.Add(session);
    await db.SaveChangesAsync(ct);
    
    return TypedResults.Ok();
});

app.Run();
// Coloque este record no final do seu Program.cs
public record WorkSessionDto(string TaskName, int DurationSeconds);

