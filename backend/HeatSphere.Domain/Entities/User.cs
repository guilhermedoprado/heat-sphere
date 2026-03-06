namespace HeatSphere.Domain.Entities;

public sealed class User
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public required string GoogleId { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public string? PictureUrl { get; set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    public ICollection<Note> Notes { get; set; } = [];
}
