namespace Application.Features.Documents.Interfaces;

public interface IDocumentHelperService
{
    public Task<bool> IsEditKeyValid(string documentId, string editKey, CancellationToken ct);
}
