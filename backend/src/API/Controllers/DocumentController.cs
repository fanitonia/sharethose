using Application.Features.Documents.DTOs.Responses;
using Application.Features.Documents.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/document")]
    [ApiController]
    public class DocumentController(IDocumentQueryService query) : ControllerBase
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
    }
}
