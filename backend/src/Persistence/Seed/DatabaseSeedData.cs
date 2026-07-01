using Microsoft.EntityFrameworkCore;

namespace Persistence.Seed;

internal static class DatabaseSeedData
{
    public static ModelBuilder SeedInitialData(this ModelBuilder modelBuilder)
    {
        // Seed initial data for the database here
        return modelBuilder;
    }
}
