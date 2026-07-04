using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using Application.Helpers;
using Domain.Entities;
using Persistence;
using shortid;

namespace Application.Features.Documents.Services;

public class DocumentCommandService(DatabaseContext context) : IDocumentCommandService
{
    ShortIdOptions idOptions = new ShortIdOptions(
        useNumbers: true, useSpecialCharacters: false, length: 15
    );

    // TODO: custom editKey by user
    // TODO: custom documentId by user
    public async Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request)
    {
        string documentId = ShortId.Generate(idOptions);
        string editKey = ShortId.Generate(idOptions);
        string? passwordHash = request.Password is not null ? Sha256Hasher.ComputeHash(request.Password) : null;

        var document = new Document
        {
            Id = documentId,
            ExpireAt = request.ExpireAt,
            Title = request.Title,
            EditKeyHash = Sha256Hasher.ComputeHash(editKey),
            PasswordHash = passwordHash,
            Pages = request.Pages.Select(p => new Page
            {
                PageName = p.PageName,
                Content = p.Content,
                PageNumber = p.PageNumber,
                DocumentId = documentId
            }).ToList()
        };

        context.Documents.Add(document);
        var result = await context.SaveChangesAsync();

        if (result <= 0)
        {
            return CommonErrors.FailedToCreate;
        }

        return (new DocumentResponse(document), editKey);

    }

    public Task<Result> DeleteDocumentAsync(string documentId)
    {
        throw new NotImplementedException();
    }

    public Task<Result> DeleteDocumentAsync(string documentId, string editKey)
    {
        throw new NotImplementedException();
    }

    public Task<Result<DocumentResponse>> UpdateDocumentAsync(UpdateDocumentRequest request, string editKey)
    {
        throw new NotImplementedException();
    }
}
