using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Security.Claims;

namespace Infrastructure.Security;
//IAuthorizationRequirement 表示一个授权要求
public class IsHostRequirement : IAuthorizationRequirement
{

}
public class IsHostRequirementHandler(
    AppDbContext dbContext,
    IHttpContextAccessor httpContextAccessor) 
    : AuthorizationHandler<IsHostRequirement>
{


    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        // 获取当前用户的ID
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return;

        // 获得路由里的活动ID
        var httpContext = httpContextAccessor.HttpContext;
        //if (httpContext?.Request.RouteValues["id"] is not string activityId) return;
        if (httpContext?.GetRouteValue("id") is not string activityId) return;
       
        // 查询数据库，看看这个用户是否是这个活动的主持人,通过活动ID和用户ID查询ActivityAttendees表，看看是否有记录，并且IsHost为true
        var attendee = await dbContext.ActivityAttendees
              .AsNoTracking()//不跟踪实体，因为我们只需要读取数据，不需要修改它，这样可以提高性能  
              .SingleOrDefaultAsync(x => x.UserId == userId && x.ActivityId == activityId);

        if (attendee == null) return;    
        if (attendee.IsHost) context.Succeed(requirement);
    }
}