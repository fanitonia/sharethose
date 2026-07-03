namespace Application.Features.Documents.DTOs.Objects;

public class PageObject
{
    public required string PageName { get; set; }
    public required string Content { get; set; }
    public ushort PageNumber { get; set; }
}
