using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class UpdateDocumentRequestValidator : AbstractValidator<UpdateDocumentContentRequest>
{
    public UpdateDocumentRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
                .WithMessage("Title is required.")
            .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

        RuleFor(q => q.Pages)
            .NotEmpty()
                .WithMessage("At least one page is required.");

        RuleForEach(q => q.Pages)
            .SetValidator(new UpdatePageRequestValidator());
    }
}
