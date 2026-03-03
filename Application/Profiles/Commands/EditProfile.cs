using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Commands;

public class EditProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public required UserProfileDto UserProfileDto { get; set; }
    }

    public class Handler(AppDbContext context, IUserAccessor userAccessor, IMapper mapper)
    : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();

            if (user == null) return Result<Unit>.Failure("User not found", 404);

            mapper.Map(request.UserProfileDto, user);//使用 AutoMapper 将 UserProfileDto 中的属性值映射到 User 实体对象中

            // context.Entry(user).State = EntityState.Modified;//强制告诉 Entity Framework (EF Core) 该实体已被修改
            var result = await context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update user profile", 400);
        }
    }

}