using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class CreatePageRequestValidator : AbstractValidator<CreatePageRequest>
{
    public CreatePageRequestValidator()
    {
        RuleFor(q => q.Name)
            .NotEmpty()
                .WithMessage("Page name is required.")
            .MaximumLength(50)
                .WithMessage("Page name must not exceed 50 characters.");

        RuleFor(q => q.Slug)
            .MaximumLength(50)
                .WithMessage("Slug must not exceed 50 characters.")
            .Matches("^[a-zA-Z0-9-]*$")
                .WithMessage("Custom slug can only contain numbers, english letters, and hyphens.")
            .When(q => !string.IsNullOrEmpty(q.Slug));

        RuleFor(q => q.Content)
            .NotEmpty()
                .WithMessage("Content is required.")
            .MaximumLength(100000)
                .WithMessage("Content must not exceed 100000 characters.");

        RuleFor(q => q.PageNumber)
            .Must(pageNumber => pageNumber > 0)
                .WithMessage("Page number must be greater than 0.");
    }
}
