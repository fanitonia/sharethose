namespace Application.Features.Documents.DTOs.Requests;

public class UpdateDocumentRequest
{
    public required string Title { get; set; }
    public string? Password { get; set; }
    public required DateTime ExpireAt { get; set; }

    public ICollection<UpdatePageRequest> Pages { get; set; } = [];
}