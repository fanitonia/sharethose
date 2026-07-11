namespace Domain.Entities;

public class Page
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public required string Slug { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }

    public Guid DocumentId { get; set; }
    public Document Document { get; set; } = null!;
}
