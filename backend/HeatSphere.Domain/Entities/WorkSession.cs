namespace HeatSphere.Domain.Entities;

public class WorkSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TaskName { get; set; } = string.Empty;
    public int DurationSeconds { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}