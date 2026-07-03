namespace Domain.Entities;

public class Document
{
    public required string Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string Title { get; set; }
    public required string EditKeyHash { get; set; }
    public string? PasswordHash { get; set; }
    public DateTime? ExpireAt { get; set; }

    public ICollection<Page> Pages { get; set; } = [];
}
