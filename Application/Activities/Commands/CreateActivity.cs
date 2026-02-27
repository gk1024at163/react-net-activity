using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class CreateActivity
{
    /// <summary>
    /// 命令表示要执行的操作
    /// </summary>
    public class Command : IRequest<Result<string>>
    {
        public required CreateActivityDto CreateActivityDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper,
        IUserAccessor userAccessor)
        : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            //获取用户对象
            var user = await userAccessor.GetUserAsync();
            //通过autoMapper映射成Activity对象
            var activity = mapper.Map<Activity>(request.CreateActivityDto);
            //添加到内存中
            context.Activities.Add(activity);//此时还没有操作数据库，不用异步

            //添加活动创建人
            activity.Attendees.Add(new ActivityAttendee
            {
                ActivityId = activity.Id,
                UserId = user.Id,
                IsHost = true
            });

            //保存到数据库
            var result = await context.SaveChangesAsync(cancellationToken);
            if (result == 0) return Result<string>.Failure("Failed to create activity", 400);
            return Result<string>.Success(activity.Id);
        }
    }
}
