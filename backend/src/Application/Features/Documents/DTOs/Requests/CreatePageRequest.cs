namespace Application.Features.Documents.DTOs.Requests;

public class CreatePageRequest
{
    public required string PageName { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }
}
