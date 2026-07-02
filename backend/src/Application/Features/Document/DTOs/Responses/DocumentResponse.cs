using Application.Features.Document.DTOs.Objects;

namespace Application.Features.Document.DTOs.Responses;

public class DocumentResponse
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public required string Title { get; set; }
    public required DateTime ExpireAt { get; set; }

    public ICollection<PageObject> Pages { get; set; } = [];
}
