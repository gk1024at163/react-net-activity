using System;
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command : IRequest<Result<string>>
    {
        public required CreateActivityDto CreateActivityDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = mapper.Map<Activity>(request.CreateActivityDto);
            context.Activities.Add(activity);//此时还没有操作数据库，不用异步
            var result = await context.SaveChangesAsync(cancellationToken);
            if (result == 0) return Result<string>.Failure("Failed to create activity", 400);
            return Result<string>.Success(activity.Id);
        }
    }
}
