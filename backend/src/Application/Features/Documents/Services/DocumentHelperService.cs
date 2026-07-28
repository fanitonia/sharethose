using Application.Features.Documents.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Documents.Services;

public class DocumentHelperService(IPasswordHasher<Document> hasher) : IDocumentHelperService
{

    public bool IsEditKeyValid(Document document, string editKey)
    {
        return hasher.VerifyHashedPassword(document, document.EditKeyHash, editKey)
            != PasswordVerificationResult.Failed;
    }

    public bool IsPasswordValid(Document document, string password)
    {
        return document.PasswordHash is not null &&
            hasher.VerifyHashedPassword(document, document.PasswordHash, password)
            != PasswordVerificationResult.Failed;
    }
}
