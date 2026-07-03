using Application.Features.Documents.DTOs.Objects;

namespace Application.Features.Documents.DTOs.Responses;

public class DocumentResponse
{
    public string Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string Title { get; set; }
    public required DateTime ExpireAt { get; set; }

    public ICollection<PageObject> Pages { get; set; } = [];
}
