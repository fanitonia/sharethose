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

    public async Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request)
    {
        string documentId = ShortId.Generate(idOptions);
        string editKey = Guid.NewGuid().ToString();
        string? passwordHash = request.Password is not null ? Sha256Hasher.ComputeHash(request.Password) : null;

        var document = new Document
        {
            Id = documentId,
            CreatedAt = DateTime.UtcNow,
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
        await context.SaveChangesAsync();

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
