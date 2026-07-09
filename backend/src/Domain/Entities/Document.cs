namespace Domain.Entities;

public class Document
{
    public required string Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string EditKeyHash { get; set; }
    public string? PasswordHash { get; set; }
    public DateTime? ExpireAt { get; set; }

    public ICollection<Page> Pages { get; set; } = [];
}
