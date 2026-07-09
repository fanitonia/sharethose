namespace Application.Features.Documents.DTOs.Requests;

public class CreatePageRequest
{
    public required string Name { get; set; }
    public string? Slug { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }
}
