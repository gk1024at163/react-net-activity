using System;

namespace Domain;

public class UserFollowing
{
    /// <summary>
    /// 关注者Id（我是发起者）
    /// </summary>
    public required string ObserverId { get; set; }
    /// <summary>
    /// 被关注者Id（我是被关注者）
    /// </summary>
    public required string TargetId { get; set; }
    /// <summary>
    /// 关注者，也可以用 Follower
    /// </summary>
    public User Observer { get; set; } = null!;

    /// <summary>
    /// 被关注者 也可以用 Followee
    /// </summary>
    public User Target { get; set; } = null!;
}
