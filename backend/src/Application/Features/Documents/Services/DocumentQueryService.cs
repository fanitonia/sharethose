using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Features.Documents.Services;

public class DocumentQueryService(DatabaseContext context, IMapper mapper) : IDocumentQueryService
{
    public async Task<DocumentResponse?> GetDocumentAsync(string documentId, CancellationToken ct)
    {
        return await context.Documents
            .AsNoTracking()
            .Where(d => d.Id == documentId)
            .ProjectTo<DocumentResponse>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(ct);
    }
}
