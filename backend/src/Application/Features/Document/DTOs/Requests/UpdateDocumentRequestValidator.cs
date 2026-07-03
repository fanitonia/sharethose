using Application.Features.Document.DTOs.Objects;
using FluentValidation;

namespace Application.Features.Document.DTOs.Requests;

public class UpdateDocumentRequestValidator : AbstractValidator<UpdateDocumentRequest>
{
    public UpdateDocumentRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
                .WithMessage("Title is required.")
            .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

        RuleFor(q => q.Password)
            .NotEmpty()
                .WithMessage("Password can't be empty.")
            .When(q => q != null);

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
