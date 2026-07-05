using Application.Common.Result;

namespace Application.Features.Errors;

public static class DocumentErrors
{
    public static Error Expired => new("Document expired", "The document has expired and no longer available.", 410);
    public static Error InvalidPassword => new("Invalid password", "The provided password is invalid.", 403);
    public static Error InvalidEditKey => new("Invalid edit key", "The provided edit key is invalid.", 403);
    public static Error NoChangesFound => new("No changes found", "No changes were found in the updated document.", 400);
}
