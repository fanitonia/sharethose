using Application.Features.Documents.Interfaces;
using Application.Features.Documents.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Application.DependencyInjection;

public static class ApplicationDependencyInjectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher<Document>, PasswordHasher<Document>>();
        services.AddScoped<IDocumentQueryService, DocumentQueryService>();
        services.AddScoped<IDocumentCommandService, DocumentCommandService>();
        services.AddHostedService<ExpiredDocumentCleaner>();

        return services;
    }
}
