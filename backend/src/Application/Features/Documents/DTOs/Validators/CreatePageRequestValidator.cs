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

        RuleFor(q => q.Content)
            .NotEmpty()
                .WithMessage("Content is required.")
            .MaximumLength(100000)
                .WithMessage("Content must not exceed 100000 characters.");
    }
}
