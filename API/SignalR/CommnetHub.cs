using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommnetHub(IMediator mediator) : Hub
{
    /// <summary>
    /// 当用户连接时，将当前用户加入以activityId命名的组中，并获取该活动的所有评论
    /// </summary>
    /// <returns></returns>
    /// <exception cref="HubException"></exception>
    public override async Task OnConnectedAsync()
    {
        // 通过HttpContext获取查询字符串中的activityId参数
        var httpContext = Context.GetHttpContext();
        var activityId = httpContext?.Request.Query["activityId"];

        if (string.IsNullOrEmpty(activityId))
        {
            throw new HubException("No activityId provided");
        }
        // 将当前连接加入到以activityId命名的组中
        await Groups.AddToGroupAsync(Context.ConnectionId, activityId!);

        // 从数据库获取该活动的所有评论
        Result<List<CommentDto>> queryResult =
                 await mediator.Send(new GetComments.Query { ActivityId = activityId! });
        // 向调用者发送评论数据 Result<List<CommentDto>> 类型 方法名 LoadComments
        await Clients.Caller.SendAsync("LoadComments", queryResult);
    }

    /// <summary>
    /// 接收来自客户端的新评论，并将其广播给所有连接到该活动的用户
    /// </summary>
    /// <param name="command"></param>
    /// <returns></returns>
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);

        //调试：输出 commentDto 的详细信息
        Console.WriteLine($"=== Sending comment to clients ===");
        Console.WriteLine($"Comment Id: {comment.Value?.Id}");
        Console.WriteLine($"Comment Body: {comment.Value?.Body}");
        Console.WriteLine($"Comment CreatedAt: {comment.Value?.CreatedAt}");
        Console.WriteLine($"Comment CreatedAt Type: {comment.Value?.CreatedAt.GetType()}");
        Console.WriteLine($"Comment UserId: {comment.Value?.UserId}");
        Console.WriteLine($"Comment DisplayName: {comment.Value?.DisplayName}");

        //向所有连接到该活动的用户发送新评论，方法名 ReceiveComment，参数是 Result<CommentDto> 类型的 comment
        //给方法名的目的：让所有连接到该活动的用户接收到新评论
        await Clients.Group(command.ActivityId)
                .SendAsync("ReceiveComment", comment);

        Console.WriteLine($"Comment sent successfully");
    }
}
