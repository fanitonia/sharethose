namespace Domain.Entities;

public class Page
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public required string PageName { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }


    public required string DocumentId { get; set; }
    public Document Document { get; set; } = null!;
}
