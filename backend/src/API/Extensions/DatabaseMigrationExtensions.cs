using Microsoft.EntityFrameworkCore;
using Serilog;

namespace API.Extensions;

public static class DatabaseMigrationExtensions
{
    public static async Task<WebApplication> MigrateDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<Persistence.AppDbContext>();
            await context.Database.MigrateAsync();
        }
        catch (Exception e)
        {
            Log.Error(e, "Something gone wrong while migrating or creating the database");
            throw;
        }

        return app;
    }
}
