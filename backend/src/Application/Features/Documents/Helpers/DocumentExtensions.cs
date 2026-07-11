using Domain.Entities;

namespace Application.Features.Documents.Helpers;

internal static class DocumentExtensions
{
    public static bool IsDocumentExpired(this Document document)
    {
        return document.ExpireAt.HasValue && document.ExpireAt.Value <= DateTime.UtcNow;
    }
}
