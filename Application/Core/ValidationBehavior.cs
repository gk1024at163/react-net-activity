using FluentValidation;
using MediatR;

namespace Application.Core;

/// <summary>
/// 用于任何处理程序的验证行为
/// </summary>
public class ValidationBehavior<TRequest, TResponse>(
    IValidator<TRequest>? validator = null)
: IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
                        TRequest request,
                        RequestHandlerDelegate<TResponse> next,
                        CancellationToken cancellationToken)
    {
        if (validator == null) return await next(cancellationToken);//如果没有验证器，传递给中间件管道的下一个中间件

        var validationResult =
        await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);//Eroors是错误列表 List<ValidationFailure>
        }
        return await next(cancellationToken);
    }
}
