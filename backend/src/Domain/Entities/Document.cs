namespace Domain.Entities;
// TODO: move UpdateContent, SetPassword, ValidateEditKey or ReorderPages to domain models Document and Page
public class Document
{
    // TODO: using Guid instead of string for Id???
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
