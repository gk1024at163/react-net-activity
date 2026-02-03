using System;
using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;


namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required EditActivityDto EditActivityDto { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
            .FindAsync([request.EditActivityDto.Id], cancellationToken);
            if (activity == null) return Result<Unit>.Failure("Activity not found", 404);
            //给实体赋值
            mapper.Map(request.EditActivityDto, activity);//第1个参数是源对象，第2个参数是目标对象
            var result = await context.SaveChangesAsync(cancellationToken);
            if (result == 0) return Result<Unit>.Failure("Failed to update activity", 400);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}
