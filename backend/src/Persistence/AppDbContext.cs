using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Seed;

namespace Persistence;

// TODO: application layer should not depend on persistence layer, create abstractions in application layer and implement them in persistence layer
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Document> Documents { get; set; }
    public DbSet<Page> Pages { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        modelBuilder.SeedInitialData();

        base.OnModelCreating(modelBuilder);
    }
}
