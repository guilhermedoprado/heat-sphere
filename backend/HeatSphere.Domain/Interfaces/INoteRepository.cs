using HeatSphere.Domain.Entities;

namespace HeatSphere.Domain.Interfaces;

public interface INoteRepository
{
    Task<Note?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Note>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<Note>> GetAllAsync(CancellationToken ct = default);
    Task AddAsync(Note note, CancellationToken ct = default);
    void Update(Note note);
    void Delete(Note note);
    Task SaveChangesAsync(CancellationToken ct = default);
}