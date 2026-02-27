using System;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities.Commands;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            //获得当前传入Id在数据库中活动信息
            var activity = await context.Activities
            .Include(x => x.Attendees)
            .ThenInclude(x => x.User)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            //获得当前用户信息
            var user = await userAccessor.GetUserAsync();
            //获得当前用户在当前活动信息中的信息
            var attendee = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);
            //判断当前用户是不是活动的组织者
            var isHost = activity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

            if (attendee != null)
            {
                //当前用户在活动信息中存在，则取消活动
                if (isHost)
                {
                    //当前用户是活动的组织者，则删除活动信息
                    activity.IsCancelled = !activity.IsCancelled;
                }
                else
                {
                    //当前用户不是活动的组织者，则取消活动信息
                    activity.Attendees.Remove(attendee);
                }
            }
            else
            {
                //当前用户在活动信息中不存在，则加入活动
                activity.Attendees.Add(new ActivityAttendee
                {
                    UserId = user.Id,
                    ActivityId = activity.Id,
                    IsHost = false
                });
            }
            var success = await context.SaveChangesAsync(cancellationToken) > 0;
            return success
             ? Result<Unit>.Success(Unit.Value)
             : Result<Unit>.Failure("Failed to update attendance", 400);
        }
    }
}
