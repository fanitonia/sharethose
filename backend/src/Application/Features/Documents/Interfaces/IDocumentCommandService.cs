using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;

namespace Application.Features.Documents.Interfaces;
// TODO: add cancelation token to all methods
// TODO: delete document editKey must be mandatory. but admin?
public interface IDocumentCommandService
{
    public Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request);
    public Task<Result<DocumentResponse>> UpdateDocumentContentAsync(UpdateDocumentContentRequest request, Guid documentId, string editKey);
    public Task<Result<DocumentResponse>> UpdateDocumentExpireDateAsync(UpdateDocumentExpireDateRequest request, Guid documentId, string editKey);
    public Task<Result> UpdateDocumentPasswordAsync(UpdateDocumentPasswordRequest request, Guid documentId, string editKey);
    public Task<Result> DeleteDocumentAsync(Guid documentId, string? editKey = null);
}
