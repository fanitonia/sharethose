namespace Application.Features.Document.DTOs.Objects;

public class PageObject
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public ushort PageNumber { get; set; }
}
