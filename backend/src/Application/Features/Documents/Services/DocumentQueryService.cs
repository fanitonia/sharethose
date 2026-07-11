using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Errors;
using Application.Features.Documents.Helpers;
using Application.Features.Documents.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Documents.Services;

// TODO: a query service should not delete data, just return the error but delete the expired one in a background service
public class DocumentQueryService(AppDbContext context, IPasswordHasher<Document> hasher) : IDocumentQueryService
{
    public async Task<Result<DocumentResponse>> GetDocumentAsync(string documentSlug, string? password, CancellationToken ct)
    {
        var document = await context.Documents
            .AsNoTracking()
            .Include(d => d.Pages)
            .Where(d => d.Slug == documentSlug)
            .FirstOrDefaultAsync(ct);

        if (document == null)
            return CommonErrors.NotFound;

        if (document.IsDocumentExpired())
            return DocumentErrors.Expired;

        if (!IsPasswordValid(document, password))
            return DocumentErrors.InvalidPassword;

        document.Pages = document.Pages.OrderBy(p => p.PageNumber).ThenBy(p => p.Id).ToList();

        return new DocumentResponse(document);

    }

    public async Task<bool> IsDocumentExistsAsync(string documentSlug, CancellationToken ct)
    {
        return await context.Documents
            .AsNoTracking()
            .AnyAsync(d => d.Slug == documentSlug, ct);
    }

    private bool IsPasswordValid(Document document, string? password)
    {
        return document.PasswordHash is null ||
            password is not null &&
            hasher.VerifyHashedPassword(document, document.PasswordHash, password)
            != PasswordVerificationResult.Failed;
    }
}
