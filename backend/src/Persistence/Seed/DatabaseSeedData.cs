using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Seed;

internal static class DatabaseSeedData
{
    public static ModelBuilder SeedInitialData(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Document>().HasData(
            new Document
            {
                Id = "sample1",
                Title = "Sample Document",
                EditKeyHash = "samplekey",
                ExpireAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc),
            }
        );

        modelBuilder.Entity<Page>().HasData(
           new Page
           {
               Id = 1,
               PageName = "Introduction",
               DocumentId = "sample1",
               Content = "# A Title\n\nThis is the content of the first page.",
               PageNumber = 1,
               CreatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
           },
           new Page
           {
               Id = 2,
               PageName = "Second Page",
               DocumentId = "sample1",
               Content = "- This is the content of the second page.",
               PageNumber = 2,
               CreatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
           }
        );

        return modelBuilder;
    }
}
