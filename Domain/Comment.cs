using System;

namespace Domain;

public class Comment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Body { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    //Navegation properties
    public required string UserId { get; set; } //每个评论都关联一个用户
    public User User { get; set; } = null!;
    public required string ActivityId { get; set; } //每个评论都关联一个活动
    public Activity Activity { get; set; } = null!;
}

