using System.Text.Json;
using Application.Core;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace API.Middleware;

public class ExceptionMiddleware(
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env) : IMiddleware
{
    public async Task InvokeAsync(
        HttpContext context, //可以访问Http上下文，进而可以访问Http请求和响应
        RequestDelegate next //请求委托，它代表下一个中间件
        )
    {
        try
        {
            await next(context);//将上下文传递给下一个中间件
        }
        catch (ValidationException ex)
        {
            await HandleValidationExceptionAsync(context, ex);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    public async Task HandleValidationExceptionAsync(HttpContext context, ValidationException ex)
    {
        var validationErros = new Dictionary<string, string[]>();
        if (ex.Errors is not null)
        {
            foreach (var error in ex.Errors)
            {
                if (validationErros.TryGetValue(error.PropertyName, out var existingErrors))
                {
                    var updatedErrors = existingErrors.Append(error.ErrorMessage).ToArray();
                    validationErros[error.PropertyName] = updatedErrors;
                }
                else
                {
                    validationErros[error.PropertyName] = new[] { error.ErrorMessage };
                }
            }
        }
        var response = context.Response;

        response.StatusCode = StatusCodes.Status400BadRequest;
        var validationProblemDetails = new ValidationProblemDetails(validationErros)
        {
            Status = StatusCodes.Status400BadRequest,
            Type = "ValidationFailure",
            Title = "Validation errors occurred.",
            Detail = "One or more validation errors occurred.",
        };
        await response.WriteAsJsonAsync(validationProblemDetails);
    }
    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var response =
        env.IsDevelopment()
            ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace)
            : new AppException(context.Response.StatusCode, ex.Message, null);

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);
    }
}
