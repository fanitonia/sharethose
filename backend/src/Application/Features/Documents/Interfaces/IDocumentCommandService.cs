using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentCommandService
{
    public Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request);
    public Task<Result<DocumentResponse>> UpdateDocumentContentAsync(UpdateDocumentContentRequest request, string documentId, string editKey);
    public Task<Result<DocumentResponse>> UpdateDocumentPasswordAsync(UpdateDocumentPasswordRequest request, string documentId, string editKey);
    public Task<Result<DocumentResponse>> UpdateDocumentExpireDateAsync(UpdateDocumentExpireDateRequest request, string documentId, string editKey);
    public Task<Result> DeleteDocumentAsync(string documentId);
    public Task<Result> DeleteDocumentAsync(string documentId, string editKey);
}
