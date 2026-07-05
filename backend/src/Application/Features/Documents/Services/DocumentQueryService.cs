using Application.Common.Errors;
using Application.Common.Result;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Extensions;
using Application.Features.Documents.Interfaces;
using Application.Features.Errors;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Documents.Services;

public class DocumentQueryService(DatabaseContext context) : IDocumentQueryService
{
    public async Task<Result<DocumentResponse>> GetDocumentAsync(string documentId, string? password, CancellationToken ct)
    {
        var document = await context.Documents
            .AsNoTracking()
            .Include(d => d.Pages)
            .Where(d => d.Id == documentId)
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

        // PageNumber is no longer DB-unique, so Id is used as a tiebreaker for a stable order.
        document.Pages = document.Pages.OrderBy(p => p.PageNumber).ThenBy(p => p.Id).ToList();

        return new DocumentResponse(document);

    }
}
