namespace HeatSphere.Domain.Entities;

public sealed class Note
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public required string Title { get; set; }
    public required string Subject { get; set; }
    public string ContentMarkdown { get; set; } = string.Empty;
    public string BriefDefinition { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<string> Tags { get; set; } = [];
}
