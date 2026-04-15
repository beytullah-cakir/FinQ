using FluentValidation;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalFinanceTracker.Infrastructure.Validation;

public class ValidationFilter<T> : IEndpointFilter where T : class
{
    private readonly IValidator<T>? _validator;

    public ValidationFilter(IValidator<T>? validator = null)
    {
        _validator = validator;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if (_validator == null) return await next(context);

        var arg = context.Arguments.FirstOrDefault(a => a is T) as T;

        if (arg == null)
        {
            return Results.BadRequest(new { message = "Geçersiz istek gövdesi." });
        }

        var validationResult = await _validator.ValidateAsync(arg);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        return await next(context);
    }
}
