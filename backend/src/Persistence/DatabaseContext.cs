using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Seed;

namespace Persistence;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<Domain.Entities.Document> Documents { get; set; }
    public DbSet<Page> Pages { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);

        modelBuilder.SeedInitialData();

        base.OnModelCreating(modelBuilder);
    }
}
