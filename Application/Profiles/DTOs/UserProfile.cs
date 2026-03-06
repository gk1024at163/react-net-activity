using System;

namespace Application.Profiles.DTOs;

public class UserProfile
{
    public required string Id { get; set; }
    public required string DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    /// <summary>
    /// 当前用户是否关注了该用户
    /// </summary>
    public bool Following { get; set; }
    /// <summary>
    /// 当前用户该用户的关注数
    /// </summary>
    public int FollowingCount { get; set; }
    /// <summary>
    /// 当前用户该用户的粉丝数
    /// </summary>
    public int FollowersCount { get; set; }
}
