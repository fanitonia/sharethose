using Application.Features.Documents.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Documents.DTOs.Validators;

public class UpdateDocumentExpireDateRequestValidator : AbstractValidator<UpdateDocumentExpireDateRequest>
{
    public UpdateDocumentExpireDateRequestValidator()
    {
        RuleFor(q => q.ExpireAt)
            .GreaterThan(DateTime.UtcNow)
                .When(q => q.ExpireAt.HasValue)
                .WithMessage("Expire time must be a future date.");
    }
}
