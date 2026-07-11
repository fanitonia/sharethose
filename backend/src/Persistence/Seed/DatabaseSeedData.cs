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
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Title = "Sample Document",
                Slug = "sample-document",
                EditKeyHash = "samplekey",
                ExpireAt = new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 7, 2, 0, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        modelBuilder.Entity<Page>().HasData(
           new Page
           {
               Id = 1,
               Name = "Introduction",
               Slug = "introduction",
               DocumentId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
               Content = "# A Title\n\nThis is the content of the first page.",
               PageNumber = 1,
               CreatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
               UpdatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc)
           },
           new Page
           {
               Id = 2,
               Name = "Second Page",
               Slug = "second-page",
               DocumentId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
               Content = "- This is the content of the second page.",
               PageNumber = 2,
               CreatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc),
               UpdatedAt = new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc)
           }
        );

        return modelBuilder;
    }
}
