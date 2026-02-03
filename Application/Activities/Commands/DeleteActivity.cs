using System;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    //Unit就是返回 void 的意思
    public class Command : IRequest<Result<Unit>>
    {
        public required string Id { get; set; }
    }
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
            .FindAsync([request.Id], cancellationToken);

            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);

            context.Activities.Remove(activity);
            var result = await context.SaveChangesAsync(cancellationToken);
            if (result == 0) return Result<Unit>.Failure("Failed to delete activity", 400);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
