using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class UpdateDocumentContentRequestValidator : AbstractValidator<UpdateDocumentContentRequest>
{
    public UpdateDocumentContentRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
                .WithMessage("Title is required.")
            .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

        RuleFor(q => q.Pages)
            .NotEmpty()
                .WithMessage("At least one page is required.")
            .Must(pages => pages.Count <= ushort.MaxValue)
                .WithMessage($"A document cannot contain more than {ushort.MaxValue} pages.");

        RuleForEach(q => q.Pages)
            .SetValidator(new UpdatePageRequestValidator());
    }
}
