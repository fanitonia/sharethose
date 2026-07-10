using API.DependencyInjection;
using API.Extensions;
using Application.DependencyInjection;
using Persistence.DependencyInjection;
using Serilog;

namespace API;
// TODO: Startup fatal errors do not fail the process, Re-throw after logging or set a non-zero exit code.
// TODO: Add tests.
public class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddWebApiServices()
                            .AddPersistenceServices(builder.Configuration)
                            .AddApplicationServices();

            var app = builder.Build();


            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/openapi/v1.json", "v1");
                    options.RoutePrefix = string.Empty;
                    options.EnablePersistAuthorization();
                });
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseCors();

            app.UseAuthorization();

            app.MapControllers();

            await app.MigrateDatabaseAsync();

            await app.RunAsync();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application terminated unexpectedly");
        }
        finally
        {
            await Log.CloseAndFlushAsync();
        }
    }
}
