using System;

namespace Domain;

public class ActivityAttendee
{
    public string? ActivityId { get; set; }
    public Activity Activity { get; set; } = null!;
    public string? UserId { get; set; }
    public User User { get; set; } = null!; //可空引用类型
    public bool IsHost { get; set; }
    public DateTime DateJoined { get; set; } = DateTime.UtcNow;

}
