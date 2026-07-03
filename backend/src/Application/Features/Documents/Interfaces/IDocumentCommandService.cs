using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentCommandService
{
    public Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request);
    public Task<Result<DocumentResponse>> UpdateDocumentAsync(UpdateDocumentRequest request, string editKey);
    public Task<Result> DeleteDocumentAsync(string documentId);
    public Task<Result> DeleteDocumentAsync(string documentId, string editKey);
}
