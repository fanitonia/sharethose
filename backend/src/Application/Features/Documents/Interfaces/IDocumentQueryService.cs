using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentQueryService
{
    public Task<DocumentResponse?> GetDocumentAsync(string documentId, CancellationToken ct);
}
