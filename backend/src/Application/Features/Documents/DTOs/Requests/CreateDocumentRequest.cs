namespace Application.Features.Documents.DTOs.Requests;

public class CreateDocumentRequest
{
    public required string Title { get; set; }
    public string? Password { get; set; }
    public DateTime? ExpireAt { get; set; }
    public string? Slug { get; set; }

    public ICollection<CreatePageRequest> Pages { get; set; } = [];
}