using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }

    //导航属性
    public ICollection<ActivityAttendee> Activities { get; set; } = [];
    public ICollection<Photo> Photos { get; set; } = [];
    /// <summary>
    /// 我关注的人列表（我是发起者）
    /// </summary>
    public ICollection<UserFollowing> Followings { get; set; } = [];
    /// <summary>
    /// 关注我的人列表（我是被关注者）
    /// </summary>
    public ICollection<UserFollowing> Followers { get; set; } = [];
}
