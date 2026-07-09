using Application.Helpers;
using Domain.Entities;

namespace Application.Features.Documents.Helpers;

internal static class DocumentExtensions
{
    public static bool IsDocumentExpired(this Document document)
    {
        return document.ExpireAt.HasValue && document.ExpireAt.Value <= DateTime.UtcNow;
    }

    public static bool IsEditKeyValid(this Document document, string editKey)
    {
        var editKeyHash = Sha256Hasher.ComputeHash(editKey);
        return document.EditKeyHash == editKeyHash;
    }

    public static bool IsPasswordValid(this Document document, string? password)
    {
        if (document.PasswordHash == null)
            return true;

        if (password == null)
            return false;

        var passwordHash = Sha256Hasher.ComputeHash(password);
        return document.PasswordHash == passwordHash;
    }
}
