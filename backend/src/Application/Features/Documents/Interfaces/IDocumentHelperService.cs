using Domain.Entities;

namespace Application.Features.Documents.Interfaces;

public interface IDocumentHelperService
{
    bool IsEditKeyValid(Document document, string editKey);

    bool IsPasswordValid(Document document, string password);
}
