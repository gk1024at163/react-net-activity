using System;

namespace Application.Activities.DTOs;

public class CommentDto
{
    public required string Id { get; set; }
    public required string Body { get; set; }
    public DateTime CreatedAt { get; set; }
    public required string UserId { get; set; }
    //比 Comment 多了 DisplayName 和 ImageUrl
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
}
