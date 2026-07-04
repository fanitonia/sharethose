using FluentValidation;

namespace Application.Features.Documents.DTOs.Requests;

public class UpdatePageValidator : AbstractValidator<UpdatePageRequest>
{
    public UpdatePageValidator()
    {
        RuleFor(q => q.PageName)
            .NotEmpty()
                .WithMessage("Page name is required.")
            .MaximumLength(50)
                .WithMessage("Page name must not exceed 50 characters.");

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
