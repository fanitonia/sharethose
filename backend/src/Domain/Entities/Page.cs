namespace Domain.Entities;

public class Page
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string PageName { get; set; }
    public required string Content { get; set; }
    public ushort PageNumber { get; set; }


    public Guid DocumentId { get; set; }
    public required Document Document { get; set; }
}
