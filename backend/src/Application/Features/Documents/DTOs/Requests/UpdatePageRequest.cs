namespace Application.Features.Documents.DTOs.Requests;
// TODO: nullable ID ???
public class UpdatePageRequest
{
    public int? Id { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }
}
