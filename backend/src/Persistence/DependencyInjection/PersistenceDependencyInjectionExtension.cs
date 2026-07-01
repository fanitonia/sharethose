using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Persistence.DependencyInjection;

public static class PersistenceDependencyInjectionExtension
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(configuration.GetConnectionString("DatabaseConnection"))
                .UseSnakeCaseNamingConvention());

        return services;
    }
}
