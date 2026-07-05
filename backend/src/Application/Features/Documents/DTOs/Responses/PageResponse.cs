namespace Application.Features.Documents.DTOs.Responses;

public class PageResponse
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public required string PageName { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }
}
