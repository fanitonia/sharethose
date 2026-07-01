namespace Domain.Entities;

public class Document
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string Title { get; set; }
    public required string EditKeyHash { get; set; }
    public string? PasswordHash { get; set; }
    public required DateTime ExpireAt { get; set; }

    public ICollection<Page> Pages { get; set; } = [];
}
