using FluentValidation;
using Serilog;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

namespace API.DependencyInjection;

internal static class APIDependencyInjectionExtension
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services)
    {
        // TODO: Add env specific configuration for logging, (builder.Host.UseSerilog) (research) 
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console()
            .CreateLogger();

        services.AddSerilog();

        services.AddControllers();
        // TODO: Add authentication and authorization
        // services.AddAuthorization();

        services.AddProblemDetails();

        services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies())
                .AddFluentValidationAutoValidation();

        services.AddOpenApi();
        // TODO: Add env specific configuration for CORS (research)
        services.AddCors(opt =>
        {
            opt.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials()
                      .WithOrigins(["http://localhost:5173"]);
            });
        });

        return services;
    }
}
