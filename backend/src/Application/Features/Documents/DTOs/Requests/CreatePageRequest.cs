namespace Application.Features.Documents.DTOs.Requests;

public class CreatePageRequest
{
    public required string Name { get; set; }
    public required string Content { get; set; }
}
