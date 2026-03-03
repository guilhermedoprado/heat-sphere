using HeatSphere.Domain.Entities;
using HeatSphere.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HeatSphere.Infrastructure.Persistence;

public sealed class NoteRepository(AppDbContext db) : INoteRepository
{
    public async Task<Note?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await db.Notes.FindAsync([id], ct);

    public async Task<IReadOnlyList<Note>> GetAllAsync(CancellationToken ct = default)
        => await db.Notes.AsNoTracking().ToListAsync(ct);

    public async Task AddAsync(Note note, CancellationToken ct = default)
        => await db.Notes.AddAsync(note, ct);

    public void Update(Note note)
        => db.Notes.Update(note);

    public void Delete(Note note)
        => db.Notes.Remove(note);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await db.SaveChangesAsync(ct);
}