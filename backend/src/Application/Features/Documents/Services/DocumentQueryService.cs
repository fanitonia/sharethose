using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Documents.Services;

public class DocumentQueryService(DatabaseContext context) : IDocumentQueryService
{
    public async Task<DocumentResponse?> GetDocumentAsync(string documentId, CancellationToken ct)
    {
        var document = await context.Documents
            .AsNoTracking()
            .Include(d => d.Pages)
            .Where(d => d.Id == documentId)
            .FirstOrDefaultAsync(ct);

        return document is null ? null : new DocumentResponse(document);
    }
}
