using API.Extensions;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/documents")]
[ApiController]
public class DocumentController(IDocumentQueryService query, IDocumentCommandService command) : ControllerBase
{

    [HttpGet("{id}")]
    public async Task<ActionResult<DocumentResponse>> GetDocument([FromRoute] string id, [FromQuery] string? password, CancellationToken ct)
    {
        var result = await query.GetDocumentAsync(id, password, ct);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return Ok(result.Value);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentResponseWithEditKey>> CreateDocument([FromBody] CreateDocumentRequest request)
    {
        var result = await command.CreateDocumentAsync(request);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return Ok(new DocumentResponseWithEditKey
        {
            Document = result.Value.document,
            EditKey = result.Value.editKey
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDocument([FromRoute] string id, [FromQuery] string editKey)
    {
        var result = await command.DeleteDocumentAsync(id, editKey);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DocumentResponse>> UpdateDocumentData([FromBody] UpdateDocumentContentRequest request, [FromRoute] string id, [FromQuery] string editKey)
    {
        var result = await command.UpdateDocumentContentAsync(request, id, editKey);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return Ok(result.Value);
    }

    [HttpPatch("{id}/expire-date")]
    public async Task<ActionResult<DocumentResponse>> UpdateDocumentExpireDate([FromBody] UpdateDocumentExpireDateRequest request, [FromRoute] string id, [FromQuery] string editKey)
    {
        var result = await command.UpdateDocumentExpireDateAsync(request, id, editKey);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return Ok(result.Value);
    }

    [HttpPatch("{id}/password")]
    public async Task<ActionResult> UpdateDocumentPassword([FromBody] UpdateDocumentPasswordRequest request, [FromRoute] string id, [FromQuery] string editKey)
    {
        var result = await command.UpdateDocumentPasswordAsync(request, id, editKey);

        if (result.IsFailure)
        {
            return result.ToProblemDetails(HttpContext);
        }

        return NoContent();
    }
}
