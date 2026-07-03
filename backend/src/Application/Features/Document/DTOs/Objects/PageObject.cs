namespace Application.Features.Document.DTOs.Objects;

public class PageObject
{
    public required string PageName { get; set; }
    public required string Content { get; set; }
    public ushort PageNumber { get; set; }
}
