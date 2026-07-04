using Application.Common.Result;

namespace Application.Common.Errors;

public static class CommonErrors
{
    public static Error FailedToCreate => new("Failed to create.", "Something went wrong while saving.", 500);
    public static Error FailedToDelete => new("Failed to delete.", "Something went wrong while deleting.", 500);
    public static Error FailedToUpdate => new("Failed to update.", "Something went wrong while updating.", 500);
}
