namespace Application.Features.Documents.DTOs.Requests;

public class UpdateDocumentContentRequest
{
    public required string Title { get; set; }
    public ICollection<UpdatePageRequest> Pages { get; set; } = [];
}