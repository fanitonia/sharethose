namespace Application.Features.Documents.DTOs.Requests;
// TODO: nullable ID ???
public class UpdatePageRequest
{
    public int? Id { get; set; }
    public required string Name { get; set; }
    public string? Slug { get; set; }
    public required string Content { get; set; }
    public required ushort PageNumber { get; set; }
}
