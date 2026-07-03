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

    public Document() { }

    public Document(string id, string title, string passwordHash, string editKeyHash, Page[] pages, DateTime? expireAt = null)
    {
        Id = id;
        Title = title;
        PasswordHash = passwordHash;
        EditKeyHash = editKeyHash;
        ExpireAt = expireAt;
        Pages = pages;
    }
}
