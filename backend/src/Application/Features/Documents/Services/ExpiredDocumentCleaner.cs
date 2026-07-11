using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Features.Documents.Services;

public class ExpiredDocumentCleaner(
    IServiceScopeFactory scopeFactory,
    ILogger<ExpiredDocumentCleaner> logger) : BackgroundService
{
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(15);
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await CleanupAsync(stoppingToken);

        using var timer = new PeriodicTimer(CleanupInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupAsync(stoppingToken);
        }
    }

    private async Task CleanupAsync(CancellationToken cancellationToken)
    {
        try
        {
            logger.LogDebug("Starting cleanup of expired documents.");

            await using var scope = scopeFactory.CreateAsyncScope();

            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var now = DateTime.UtcNow;

            var deletedCount = await db.Documents
                .Where(d => d.ExpireAt.HasValue && d.ExpireAt.Value <= now)
                .ExecuteDeleteAsync(cancellationToken);

            if (deletedCount > 0)
            {
                logger.LogInformation("Deleted {DeletedCount} expired documents.", deletedCount);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            logger.LogDebug("Cleanup operation was canceled.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while cleaning up expired documents.");
        }
    }
}
