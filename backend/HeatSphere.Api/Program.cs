using HeatSphere.Application.Features.HeatExchangers.RateShellAndTube;
using HeatSphere.Application.Features.ExternalFlow.CalculateCylinder;
using HeatSphere.Application.Interfaces;
using HeatSphere.Application.Services;
using HeatSphere.Domain.Common;
using HeatSphere.Domain.Entities;
using HeatSphere.Domain.Interfaces;
using HeatSphere.Infrastructure;
using HeatSphere.Infrastructure.Repositories;
using HeatSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer(); // allow Swagger to find endpoints
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// CORS (para React em http://localhost:5173)
const string CorsPolicy = "FrontendDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Infrastructure (PostgreSQL + DbContext)
builder.Services.AddInfrastructure(builder.Configuration);

// Register repositories and services
builder.Services.AddScoped<IFluidRepository, FluidRepository>();
builder.Services.AddScoped<FluidInterpolationService>();
builder.Services.AddScoped<RateShellAndTubeHandler>();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CalculateCylinderFlowHandler).Assembly));

var app = builder.Build();

app.UseCors(CorsPolicy); // allow CORS globally

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

// ── Auto-apply migrations on startup (dev only) ─────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

var api = app.MapGroup("/api");

// ── Notes CRUD ──────────────────────────────────────────────
var notes = api.MapGroup("/notes");

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

app.Run();