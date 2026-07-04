using API.Extensions;
using Application.Features.Documents.DTOs.Requests;
using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/document")]
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

        [HttpPost()]
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
    }
}
