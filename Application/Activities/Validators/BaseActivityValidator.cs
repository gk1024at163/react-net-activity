using System;
using System.Linq.Expressions;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

/// <summary>
/// Base class for validators 继承自 AbstractValidator 的基类
/// </summary>
/// <typeparam name="T">要验证的根对象类型（通常是 Command)</typeparam>
/// <typeparam name="TDto">被验证的实际数据载体(继承自 BaseActivityDto)</typeparam>
public class BaseActivityValidator<T, TDto>
            : AbstractValidator<T> where TDto : BaseActivityDto
{

    /// <summary>
    /// 构造函数传递一个泛型函数，这个函数接受类型为T的函数，返回一个 TDto 类型对象,让子类告诉基类：“怎么从 T 拿到 TDto”
    /// </summary>
    /// <param name="selector">一个函数，用于从 T 类型对象中选择出 TDto 类型对象
    /// 这是一个泛型函数，接受一个参数，返回一个对象。这个函数的作用是从 T 类型的对象中提取出 TDto 类型的对象，以便在验证规则中使用 TDto 的属性进行验证。
    /// </param>
    // public BaseActivityValidator(Func<T, TDto> selector)
    // {
    //     RuleFor(x => selector(x).Title)
    //     .NotEmpty()
    //     .WithMessage("Title is required")
    //             .MaximumLength(100)
    //             .WithMessage("Title must not exceed 100 characters");
    //     RuleFor(x => selector(x).Description)
    //          .NotEmpty().WithMessage("Description is required");
    //     RuleFor(x => selector(x).Date)
    //     .GreaterThan(DateTime.UtcNow)
    //     .WithMessage("Date must be in the future");
    //     RuleFor(x => selector(x).Category)
    //     .NotEmpty().WithMessage("Category is required");
    //     RuleFor(x => selector(x).City)
    //     .NotEmpty().WithMessage("City is required");
    //     RuleFor(x => selector(x).Venue)
    //     .NotEmpty().WithMessage("Venue is required");
    //     RuleFor(x => selector(x).Latitude)
    //     .NotEmpty().WithMessage("Latitude is required")
    //         .InclusiveBetween(-90, 90)
    //         .WithMessage("Latitude must be between -90 and 90");
    //     RuleFor(x => selector(x).Longitude)
    //     .NotEmpty().WithMessage("Longitude is required")
    //         .InclusiveBetween(-180, 180)
    //         .WithMessage("Longitude must be between -180 and 180");
    // }

    public BaseActivityValidator(Expression<Func<T, TDto>> selector)
    {
        RuleFor(selector.Append(x => x.Title))
        .NotEmpty()
        .WithMessage("Title is required")
                .MaximumLength(100)
                .WithMessage("Title must not exceed 100 characters");
        RuleFor(selector.Append(x => x.Description))
             .NotEmpty().WithMessage("Description is required");
        RuleFor(selector.Append(x => x.Date))
        .GreaterThan(DateTime.UtcNow)
        .WithMessage("Date must be in the future");
        RuleFor(selector.Append(x => x.Category))
        .NotEmpty().WithMessage("Category is required");
        RuleFor(selector.Append(x => x.City))
        .NotEmpty().WithMessage("City is required");
        RuleFor(selector.Append(x => x.Venue))
        .NotEmpty().WithMessage("Venue is required");
        RuleFor(selector.Append(x => x.Latitude))
        .NotEmpty().WithMessage("Latitude is required")
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90");
        RuleFor(selector.Append(x => x.Longitude))
        .NotEmpty().WithMessage("Longitude is required")
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180");
    }

}



// 扩展方法：安全合并表达式
public static class ExpressionExtensions
{
    public static Expression<Func<T, TProperty>> Append<T, TDto, TProperty>(
        this Expression<Func<T, TDto>> source,
        Expression<Func<TDto, TProperty>> property)
    {
        var visitor = new ParameterReplaceVisitor(source.Body, property.Parameters[0]);
        var body = visitor.Visit(property.Body);
        return Expression.Lambda<Func<T, TProperty>>(body, source.Parameters[0]);
    }

    private class ParameterReplaceVisitor : ExpressionVisitor
    {
        private readonly Expression _newExpr;
        private readonly ParameterExpression _oldParam;

        public ParameterReplaceVisitor(Expression newExpr, ParameterExpression oldParam)
        {
            _newExpr = newExpr;
            _oldParam = oldParam;
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _oldParam ? _newExpr : base.VisitParameter(node);
    }
}