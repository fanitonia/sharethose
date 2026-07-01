using Microsoft.EntityFrameworkCore;
using Serilog;

namespace API.Extensions;

public static class DatabaseMigrationExtension
{
    public static async Task<WebApplication> MigrateDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<Persistence.DatabaseContext>();
            await context.Database.MigrateAsync();
        }
        catch (Exception e)
        {
            Log.Error(e, "Something gone wrong while migrating or creating the database");
        }

        return app;
    }
}
