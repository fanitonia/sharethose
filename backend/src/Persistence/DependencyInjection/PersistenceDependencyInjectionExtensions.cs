using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Persistence.DependencyInjection;

// TODO: Options pattern is not used(?), Introduce typed options such as DatabaseOptions and CorsOptions. (research)
public static class PersistenceDependencyInjectionExtensions
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("DatabaseConnection"))
                .UseSnakeCaseNamingConvention());

        return services;
    }
}
