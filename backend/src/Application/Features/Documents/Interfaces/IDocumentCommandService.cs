using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentCommandService
{
    public Task CreateDocumentAsync(CreateDocumentRequest request);
    public Task<Result<DocumentResponse>> UpdateDocumentAsync(UpdateDocumentRequest request, string editKey);
    public Task DeleteDocumentAsync(string documentId);
    public Task DeleteDocumentAsync(string documentId, string editKey);
}
