using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Profiles.Commands;

public class FollowToggle
{
    public class Command : IRequest<Result<Unit>>
    {
        public required string TargetUserId { get; set; }
    }
    public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken ct)
        {
            var observer = await userAccessor.GetUserAsync();
            var target = await context.Users.FindAsync([request.TargetUserId], ct);
            if (target == null) return Result<Unit>.Failure("User not found", 400);
            //查询 UserFollowings 表，检查是否存在 observer 和 target 之间的关注关系
            var userFollowing = await context.UserFollowings
                    .FindAsync([observer.Id, target.Id], ct);
            if (userFollowing == null)
            {
                context.UserFollowings.Add(new UserFollowing { ObserverId = observer.Id, TargetId = target.Id });
            }
            else context.UserFollowings.Remove(userFollowing);
            return await context.SaveChangesAsync(ct) > 0
                 ? Result<Unit>.Success(Unit.Value)
                 : Result<Unit>.Failure("Failed to update following", 400);
        }
    }
}
