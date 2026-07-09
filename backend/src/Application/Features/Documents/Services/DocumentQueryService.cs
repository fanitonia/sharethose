using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Errors;
using Application.Features.Documents.Helpers;
using Application.Features.Documents.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Documents.Services;

public class DocumentQueryService(DatabaseContext context) : IDocumentQueryService
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
        {
            context.Remove(document);
            await context.SaveChangesAsync(ct);

            return DocumentErrors.Expired;
        }

        if (!document.IsPasswordValid(password))
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
}
