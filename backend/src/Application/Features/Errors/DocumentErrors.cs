using Application.Common.Result;

namespace Application.Features.Errors;

public static class DocumentErrors
{
    public static Error Expired => new("Document expired", "The document has expired and no longer available.", 410);
    public static Error InvalidPassword => new("Invalid password", "The provided password is invalid.", 403);
}
