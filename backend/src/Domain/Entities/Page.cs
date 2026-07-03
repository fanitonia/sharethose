namespace Domain.Entities;

public class Page
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string PageName { get; set; }
    public required string Content { get; set; }
    public ushort PageNumber { get; set; }


    public required string DocumentId { get; set; }
    public Document Document { get; set; } = null!;

    public Page() { }

    public Page(string pageName, string content, ushort pageNumber, string documentId)
    {
        PageName = pageName;
        Content = content;
        PageNumber = pageNumber;
        DocumentId = documentId;
    }
}
