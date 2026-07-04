using Application.Common.Result;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentQueryService
{
    public Task<Result<DocumentResponse>> GetDocumentAsync(string documentId, string? password, CancellationToken ct);
}
