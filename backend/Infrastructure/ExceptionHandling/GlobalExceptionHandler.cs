namespace PersonalFinanceTracker.Infrastructure.ExceptionHandling;

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

// C# 14 Primary Constructor özelliği: Sınıf başlığında constructor parametreleri ile doğrudan DI
public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Uygulamada beklenmeyen bir hata gerçekleşti: {Message}", exception.Message);

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Sunucu Hatası",
            Detail = "İşleminiz gerçekleştirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Hatanın handle edildiğini belirtir, pipeline'daki diğer handler'ların çalışmasını engeller
    }
}
