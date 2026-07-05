using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class UpdateDocumentPasswordRequestValidator : AbstractValidator<UpdateDocumentPasswordRequest>
{
    public UpdateDocumentPasswordRequestValidator()
    {
        RuleFor(x => x.Password)
            .NotEmpty()
                .WithMessage("Password cannot be empty string.")
                .When(x => x.Password != null)
            .MaximumLength(100)
                .WithMessage("Password cannot exceed 100 characters.");
    }
}
