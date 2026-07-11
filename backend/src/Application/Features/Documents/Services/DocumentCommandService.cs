using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Errors;
using Application.Features.Documents.Helpers;
using Application.Features.Documents.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using shortid;

namespace Application.Features.Documents.Services;

public class DocumentCommandService(
    AppDbContext context,
    IDocumentQueryService query,
    IPasswordHasher<Document> passwordHasher) : IDocumentCommandService
{
    ShortIdOptions idOptions = new ShortIdOptions(
        useNumbers: true, useSpecialCharacters: false, length: 15
    );

    // TODO: custom editKey by user
    // TODO: remove the check for slug existence, because db will return a error anyway, catch DbUpdateException and return a proper error message (research)
    // TODO: remove custom page slugs
    public async Task<Result<(DocumentResponse document, string editKey)>> CreateDocumentAsync(CreateDocumentRequest request)
    {
        if (request.Slug is not null && await query.IsDocumentExistsAsync(request.Slug, CancellationToken.None))
        {
            return DocumentErrors.SlugAlreadyExists;
        }

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
            Pages = request.Pages.Select(p => new Page
            {
                Name = p.Name,
                Slug = p.Slug ?? GenerateSlug(p.Name),
                Content = p.Content,
                PageNumber = p.PageNumber,
                DocumentId = documentId
            }).ToList()
        };

        document.EditKeyHash = passwordHasher.HashPassword(document, editKey);
        document.PasswordHash = request.Password is null
            ? null
            : passwordHasher.HashPassword(document, request.Password);

        var reorderedPages = ReorderPages(document.Pages.ToArray());
        document.Pages = reorderedPages;

        context.Documents.Add(document);
        var result = await context.SaveChangesAsync();

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

    // TODO: if only page number changed, do not update the page updatedAt, only update the document updatedAt. 
    public async Task<Result<DocumentResponse>> UpdateDocumentContentAsync(UpdateDocumentContentRequest request, Guid documentId, string editKey)
    {
        var document = await context.Documents
            .Include(d => d.Pages)
            .FirstOrDefaultAsync(d => d.Id == documentId);

        if (document is null)
            return CommonErrors.NotFound;

        if (!IsEditKeyValid(document, editKey))
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

                if (existingPage.Name != pageRequest.Name)
                {
                    existingPage.Name = pageRequest.Name;
                    pageChanged = true;
                }

                if (existingPage.Slug != pageRequest.Slug)
                {
                    existingPage.Slug = pageRequest.Slug ?? GenerateSlug(pageRequest.Name);
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
                    Name = pageRequest.Name,
                    Slug = pageRequest.Slug ?? GenerateSlug(pageRequest.Name),
                    Content = pageRequest.Content,
                    PageNumber = pageRequest.PageNumber,
                    DocumentId = documentId
                });

                documentChanged = true;
            }
        }

        // Reorder pages to ensure consistent ordering
        var orderedPages = ReorderPages(document.Pages.ToArray());

        document.Pages = orderedPages;

        if (!documentChanged)
            return DocumentErrors.NoChangesFound;

        document.UpdatedAt = DateTime.UtcNow;

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

        document.PasswordHash = passwordHasher.HashPassword(document, request.Password);
        document.UpdatedAt = DateTime.UtcNow;

        var result = await context.SaveChangesAsync();

        if (result <= 0)
            return CommonErrors.FailedToUpdate;

        return Result.Success();
    }

    private bool IsEditKeyValid(Document document, string editKey)
    {
        return passwordHasher.VerifyHashedPassword(document, document.EditKeyHash, editKey)
            != PasswordVerificationResult.Failed;
    }

    private bool IsPasswordValid(Document document, string password)
    {
        return document.PasswordHash is not null &&
            passwordHasher.VerifyHashedPassword(document, document.PasswordHash, password)
            != PasswordVerificationResult.Failed;
    }

    // TODO: bunu yapmak yerine client'tan gelen request'in sırasına göre sayfaları number'larını güncellemek daha mantıklı olabilir. Çünkü client'tan gelen request'in sırası, kullanıcı tarafından belirlenen sıralamayı temsil eder. Bu nedenle, sayfaları yeniden sıralamak yerine, client'tan gelen request'in sırasına göre sayfa numaralarını güncellemek daha doğru bir yaklaşım olabilir.
    private List<Page> ReorderPages(Page[] pages)
    {
        var orderedPages = pages
            .OrderBy(p => p.PageNumber)
            .ThenBy(p => p.Id)
            .ToList();
        for (var i = 0; i < orderedPages.Count; i++)
        {
            var expectedPageNumber = (ushort)(i + 1);
            if (orderedPages[i].PageNumber != expectedPageNumber)
                orderedPages[i].PageNumber = expectedPageNumber;
        }
        return orderedPages;
    }

    // TODO: use a proper slug generation (Slugify.Core)
    private string GenerateSlug(string title)
    {
        var slug = title.ToLower().Trim().Replace(" ", "-").Normalize();
        return slug;
    }
}
