using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class CreateDocumentRequestValidator : AbstractValidator<CreateDocumentRequest>
{
    public CreateDocumentRequestValidator()
    {
        RuleFor(q => q.Title)
            .NotEmpty()
                .WithMessage("Title is required.")
            .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters.");

        RuleFor(q => q.Slug)
            .MaximumLength(50)
                .WithMessage("Slug must not exceed 50 characters.")
            .Matches("^[a-zA-Z0-9-]*$")
                .WithMessage("Custom slug can only contain numbers, english letters, and hyphens.")
            .When(q => !string.IsNullOrEmpty(q.Slug));

        RuleFor(q => q.Password)
            .NotEmpty()
                .WithMessage("Password can't be empty.")
            .When(q => q.Password != null);

        RuleFor(q => q.ExpireAt)
            .GreaterThan(DateTime.UtcNow)
                .WithMessage("Expire time must be a future date.");

        RuleFor(q => q.Pages)
            .NotEmpty()
                .WithMessage("At least one page is required.")
            .Must(pages => pages.Count <= ushort.MaxValue)
                .WithMessage($"A document cannot contain more than {ushort.MaxValue} pages.");

        RuleForEach(q => q.Pages)
            .SetValidator(new CreatePageRequestValidator());
    }
}
