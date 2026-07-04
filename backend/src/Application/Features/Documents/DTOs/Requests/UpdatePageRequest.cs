namespace Application.Features.Documents.DTOs.Requests;

public class UpdatePageRequest
{
    public required string PageName { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }
}
