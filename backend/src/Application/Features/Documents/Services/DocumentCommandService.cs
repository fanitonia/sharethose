using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Errors;
using Application.Features.Documents.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Persistence;
using shortid;
using Slugify;

namespace Application.Features.Documents.Services;

public class DocumentCommandService(
    AppDbContext context,
    IPasswordHasher<Document> hasher) : IDocumentCommandService
{
    ShortIdOptions idOptions = new ShortIdOptions(
        useNumbers: true, useSpecialCharacters: false, length: 15
    );

    // TODO: custom editKey by user
    public async Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request)
    {
        Guid documentId = Guid.NewGuid();
        string slug = request.Slug ?? ShortId.Generate(idOptions);
        string editKey = ShortId.Generate(idOptions);

        var document = new Document
        {
            Id = documentId,
            Slug = slug,
            ExpireAt = request.ExpireAt,
            Title = request.Title,
            EditKeyHash = string.Empty,
            Pages = request.Pages.Select((p, index) => new Page
            {
                Name = p.Name,
                Slug = GenerateSlug(p.Name),
                Content = p.Content,
                PageNumber = (ushort)(index + 1),
                DocumentId = documentId
            }).ToList()
        };

        document.EditKeyHash = hasher.HashPassword(document, editKey);
        document.PasswordHash = request.Password is null
            ? null
            : hasher.HashPassword(document, request.Password);

        context.Documents.Add(document);
        int result;
        try
        {
            result = await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException
        {
            SqlState: PostgresErrorCodes.UniqueViolation,
            ConstraintName: "ix_documents_slug"
        })
        {
            return DocumentErrors.SlugAlreadyExists;
        }

        if (result <= 0)
        {
            return CommonErrors.FailedToCreate;
        }

        return (new DocumentResponse(document), editKey);

    }

    public async Task<Result> DeleteDocumentAsync(Guid documentId, string? editKey = null)
    {
        var document = await context.Documents.FindAsync(documentId);
        if (document is null)
            return CommonErrors.NotFound;

        if (editKey is not null && !IsEditKeyValid(document, editKey))
            return DocumentErrors.InvalidEditKey;

        context.Documents.Remove(document);
        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToDelete;

        return Result.Success();
    }

    public async Task<Result<DocumentResponse>> UpdateDocumentContentAsync(UpdateDocumentContentRequest request, Guid documentId, string editKey)
    {
        var document = await context.Documents
            .Include(d => d.Pages)
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document is null)
            return CommonErrors.NotFound;

        if (!IsEditKeyValid(document, editKey))
            return DocumentErrors.InvalidEditKey;

        var existingPagesById = document.Pages.ToDictionary(page => page.Id);
        var requestedPageIds = request.Pages
            .Where(page => page.Id.HasValue)
            .Select(page => page.Id!.Value)
            .ToArray();

        if (requestedPageIds.Distinct().Count() != requestedPageIds.Length ||
            requestedPageIds.Any(pageId => !existingPagesById.ContainsKey(pageId)))
        {
            return CommonErrors.InvalidInput;
        }

        var documentChanged = false;
        var changedAt = DateTime.UtcNow;

        if (document.Title != request.Title)
        {
            document.Title = request.Title;
            documentChanged = true;
        }

        var requestedPageIdSet = requestedPageIds.ToHashSet();
        foreach (var removedPage in document.Pages.Where(page => !requestedPageIdSet.Contains(page.Id)).ToList())
        {
            document.Pages.Remove(removedPage);
            documentChanged = true;
        }

        foreach (var (pageRequest, index) in request.Pages.Select((page, index) => (page, index)))
        {
            var pageNumber = (ushort)(index + 1);

            if (pageRequest.Id is int pageId)
            {
                var existingPage = existingPagesById[pageId];
                var pageChanged = false;

                if (existingPage.Name != pageRequest.Name)
                {
                    existingPage.Name = pageRequest.Name;
                    existingPage.Slug = GenerateSlug(pageRequest.Name);
                    pageChanged = true;
                }

                if (existingPage.Content != pageRequest.Content)
                {
                    existingPage.Content = pageRequest.Content;
                    pageChanged = true;
                }

                if (existingPage.PageNumber != pageNumber)
                {
                    existingPage.PageNumber = pageNumber;
                    pageChanged = true;
                }

                if (pageChanged)
                {
                    existingPage.UpdatedAt = changedAt;
                    documentChanged = true;
                }
            }
            else
            {
                document.Pages.Add(new Page
                {
                    Name = pageRequest.Name,
                    Slug = GenerateSlug(pageRequest.Name),
                    Content = pageRequest.Content,
                    PageNumber = pageNumber,
                    DocumentId = documentId
                });

                documentChanged = true;
            }
        }

        if (!documentChanged)
            return DocumentErrors.NoChangesFound;

        document.UpdatedAt = changedAt;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return new DocumentResponse(document);
    }

    public async Task<Result<DocumentResponse>> UpdateDocumentExpireDateAsync(UpdateDocumentExpireDateRequest request, Guid documentId, string editKey)
    {
        var document = await context.Documents.Include(d => d.Pages).FirstOrDefaultAsync(d => d.Id == documentId);

        if (document == null)
            return CommonErrors.NotFound;

        if (!IsEditKeyValid(document, editKey))
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

    public async Task<Result> UpdateDocumentPasswordAsync(UpdateDocumentPasswordRequest request, Guid documentId, string editKey)
    {
        var document = await context.Documents.FindAsync(documentId);

        if (document == null)
            return CommonErrors.NotFound;

        if (!IsEditKeyValid(document, editKey))
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

        if (IsPasswordValid(document, request.Password))
            return DocumentErrors.NoChangesFound;

        document.PasswordHash = hasher.HashPassword(document, request.Password);
        document.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return Result.Success();
    }

    private bool IsEditKeyValid(Document document, string editKey)
    {
        return hasher.VerifyHashedPassword(document, document.EditKeyHash, editKey)
            != PasswordVerificationResult.Failed;
    }

    private bool IsPasswordValid(Document document, string password)
    {
        return document.PasswordHash is not null &&
            hasher.VerifyHashedPassword(document, document.PasswordHash, password)
            != PasswordVerificationResult.Failed;
    }

    private string GenerateSlug(string title)
    {
        SlugHelper slugHelper = new SlugHelper();
        string slug = slugHelper.GenerateSlug(title);

        if (String.IsNullOrEmpty(slug))
            slug = ShortId.Generate(idOptions);

        return slug;
    }
}
