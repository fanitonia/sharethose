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
        public async Task<ActionResult<DocumentResponse>> GetDocument([FromRoute] string id, CancellationToken ct)
        {
            var document = await query.GetDocumentAsync(id, ct);

            if (document == null)
            {
                return NotFound();
            }

            return Ok(document);
        }

        // TODO: return edit key also
        [HttpPost()]
        public async Task<ActionResult<DocumentResponse>> CreateDocument([FromBody] CreateDocumentRequest request)
        {
            var result = await command.CreateDocumentAsync(request);

            if (result.IsFailure)
            {
                return BadRequest();
            }

            return Ok(result.Value.document);
        }
    }
}
