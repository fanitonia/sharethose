using Application.Features.Documents.DTOs.Objects;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Requests;

public class CreateDocumentRequestValidator : AbstractValidator<CreateDocumentRequest>
{
    public CreateDocumentRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
                .WithMessage("Title is required.")
            .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

        RuleFor(q => q.Password)
            .NotEmpty()
                .WithMessage("Password can't be empty.")
            .When(q => q.Password != null);

        RuleFor(q => q.ExpireAt)
            .GreaterThan(DateTime.Now)
                .WithMessage("Expire time must be a future date.");

        RuleFor(q => q.Pages)
            .NotEmpty()
                .WithMessage("At least one page is required.");

        RuleForEach(q => q.Pages)
            .SetValidator(new PageObjectValidator());
    }
}
