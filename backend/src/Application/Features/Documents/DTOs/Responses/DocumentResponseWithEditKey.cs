namespace Application.Features.Documents.DTOs.Responses;

public class DocumentResponseWithEditKey
{
    public required DocumentResponse Document { get; set; }
    public required string EditKey { get; set; }
}
