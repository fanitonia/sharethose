using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Errors;
using Application.Features.Documents.Extensions;
using Application.Features.Documents.Interfaces;
using Application.Helpers;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
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

    public async Task<Result> DeleteDocumentAsync(string documentId, string? editKey = null)
    {
        var document = await context.Documents.FindAsync(documentId);
        if (document is null)
            return CommonErrors.NotFound;

        if (editKey is not null && !document.IsEditKeyValid(editKey))
            return DocumentErrors.InvalidEditKey;

        context.Documents.Remove(document);
        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToDelete;

        return Result.Success();
    }

    // TODO: if only page number changed, do not update the page updatedAt, only update the document updatedAt. 
    public async Task<Result<DocumentResponse>> UpdateDocumentContentAsync(UpdateDocumentContentRequest request, string documentId, string editKey)
    {
        var document = await context.Documents
            .Include(d => d.Pages)
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document is null)
            return CommonErrors.NotFound;

        if (!document.IsEditKeyValid(editKey))
            return DocumentErrors.InvalidEditKey;

        var documentChanged = false;

        if (document.Title != request.Title)
        {
            document.Title = request.Title;
            documentChanged = true;
        }

        var existingPagesById = document.Pages.ToDictionary(p => p.Id);
        var requestedPageIds = request.Pages
            .Where(p => p.Id.HasValue)
            .Select(p => p.Id!.Value)
            .ToHashSet();

        foreach (var removedPage in document.Pages.Where(p => !requestedPageIds.Contains(p.Id)).ToList())
        {
            document.Pages.Remove(removedPage);
            documentChanged = true;
        }

        foreach (var pageRequest in request.Pages)
        {
            if (pageRequest.Id is int id && existingPagesById.TryGetValue(id, out var existingPage))
            {
                var pageChanged = false;

                if (existingPage.PageName != pageRequest.PageName)
                {
                    existingPage.PageName = pageRequest.PageName;
                    pageChanged = true;
                }

                if (existingPage.Content != pageRequest.Content)
                {
                    existingPage.Content = pageRequest.Content;
                    pageChanged = true;
                }

                if (existingPage.PageNumber != pageRequest.PageNumber)
                {
                    existingPage.PageNumber = pageRequest.PageNumber;
                    pageChanged = true;
                }

                if (pageChanged)
                {
                    existingPage.UpdatedAt = DateTime.UtcNow;
                    documentChanged = true;
                }
            }
            else
            {
                // request page Id is null means a new page
                document.Pages.Add(new Page
                {
                    PageName = pageRequest.PageName,
                    Content = pageRequest.Content,
                    PageNumber = pageRequest.PageNumber,
                    DocumentId = documentId
                });

                documentChanged = true;
            }
        }

        // Reorder pages to ensure consistent ordering
        var orderedPages = document.Pages
            .OrderBy(p => p.PageNumber)
            .ThenBy(p => p.Id)
            .ToList();

        for (var i = 0; i < orderedPages.Count; i++)
        {
            var expectedPageNumber = (ushort)(i + 1);

            if (orderedPages[i].PageNumber != expectedPageNumber)
                orderedPages[i].PageNumber = expectedPageNumber;
        }

        document.Pages = orderedPages;

        if (!documentChanged)
            return DocumentErrors.NoChangesFound;

        document.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return new DocumentResponse(document);
    }

    public async Task<Result<DocumentResponse>> UpdateDocumentExpireDateAsync(UpdateDocumentExpireDateRequest request, string documentId, string editKey)
    {
        var document = await context.Documents.Include(d => d.Pages).FirstOrDefaultAsync(d => d.Id == documentId);

        if (document == null)
            return CommonErrors.NotFound;

        if (!document.IsEditKeyValid(editKey))
            return DocumentErrors.InvalidEditKey;

        if (document.ExpireAt == request.ExpireAt)
            return DocumentErrors.NoChangesFound;

        if (request.ExpireAt.HasValue && request.ExpireAt.Value <= DateTime.UtcNow)
            return CommonErrors.InvalidInput;

        document.ExpireAt = request.ExpireAt;
        document.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return new DocumentResponse(document);
    }

    public async Task<Result> UpdateDocumentPasswordAsync(UpdateDocumentPasswordRequest request, string documentId, string editKey)
    {
        var document = await context.Documents.FindAsync(documentId);

        if (document == null)
            return CommonErrors.NotFound;

        if (!document.IsEditKeyValid(editKey))
            return DocumentErrors.InvalidEditKey;

        if (request.Password is null)
        {
            if (document.PasswordHash is null)
                return DocumentErrors.NoChangesFound;

            document.PasswordHash = null;
            document.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();

            return Result.Success();
        }

        if (document.PasswordHash == Sha256Hasher.ComputeHash(request.Password))
            return DocumentErrors.NoChangesFound;

        document.PasswordHash = Sha256Hasher.ComputeHash(request.Password);
        document.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return Result.Success();
    }
}
