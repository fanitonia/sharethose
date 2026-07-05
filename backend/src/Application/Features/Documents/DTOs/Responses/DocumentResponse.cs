using Domain.Entities;
using System.Diagnostics.CodeAnalysis;

namespace Application.Features.Documents.DTOs.Responses;

public class DocumentResponse
{
    public required string Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public required string Title { get; set; }
    public DateTime? ExpireAt { get; set; }

    public ICollection<PageResponse> Pages { get; set; } = [];

    public DocumentResponse()
    {

    }

    [SetsRequiredMembers]
    public DocumentResponse(Document document)
    {
        Id = document.Id;
        CreatedAt = document.CreatedAt;
        UpdatedAt = document.UpdatedAt;
        Title = document.Title;
        ExpireAt = document.ExpireAt;
        Pages = document.Pages.Select(p => new PageResponse
        {
            Id = p.Id,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            PageName = p.PageName,
            Content = p.Content,
            PageNumber = p.PageNumber
        }).ToList();
    }
}
