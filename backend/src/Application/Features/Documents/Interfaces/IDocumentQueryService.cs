using Application.Common.Result;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentQueryService
{
    public Task<Result<DocumentResponse>> GetDocumentAsync(string documentSlug, string? password, CancellationToken ct);
    public Task<bool> IsDocumentExistsAsync(string documentSlug, CancellationToken ct);
    public Task<Result> ValidateDocumentKeyAsync(Guid documentId, string editKey, CancellationToken ct);
}
