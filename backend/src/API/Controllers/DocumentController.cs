using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/document")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        [HttpPost("{id}")]
        public async Task<ActionResult> CreateDocument([FromRoute] Guid id, [FromBody] string document)
        {
            return Ok();

        }
    }
}
