using Application.Common.Result;

namespace Application.Features.Documents.Errors;

public static class DocumentErrors
{
    public static Error Expired => new("Document expired", "The document has expired and no longer available.", 410);
    public static Error InvalidPassword => new("Invalid password", "The provided password is invalid.", 403);
    public static Error InvalidEditKey => new("Invalid edit key", "The provided edit key is invalid.", 403);
    public static Error NoChangesFound => new("No changes found", "No changes were found in the updated document.", 400);
    public static Error SlugAlreadyExists => new("Slug already exists", "The provided slug already exists. Please choose a different slug.", 409);

}
