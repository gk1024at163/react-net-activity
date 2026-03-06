using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Persistence;

public class AppDbContext(DbContextOptions options)
: IdentityDbContext<User>(options)
{
    public required DbSet<Activity> Activities { get; set; }
    //4. 配置多对多关系
    public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    public required DbSet<Photo> Photos { get; set; }
    public required DbSet<Comment> Comments { get; set; }
    public required DbSet<UserFollowing> UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        //1. 配置主键

        builder.Entity<ActivityAttendee>()
            .HasKey(x => new { x.ActivityId, x.UserId });
        // 2. 配置外键
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.User)
            .WithMany(x => x.Activities)
            .HasForeignKey(x => x.UserId);
        // 3. 配置关系
        builder.Entity<ActivityAttendee>()
            .HasOne(x => x.Activity)
            .WithMany(x => x.Attendees)
            .HasForeignKey(x => x.ActivityId);

        // 配置 UserFollowing 的复合主键
        builder.Entity<UserFollowing>(x =>
        {
            // 1. 配置复合主键（两个字段组合起来作为主键）
            x.HasKey(x => new { x.ObserverId, x.TargetId });
            // 2. 配置"关注者"这一侧的关系
            x.HasOne(x => x.Observer)           // UserFollowing 有一个 Observer（用户 A）
             .WithMany(x => x.Followings)       // 这个用户可以有很多 Followings（他关注的人）
             .HasForeignKey(x => x.ObserverId)  // 外键是 ObserverId
             .OnDelete(DeleteBehavior.Restrict); //  防止循环依赖和级联删除
            // 3. 配置"被关注者"这一侧的关系
            x.HasOne(x => x.Target)             // UserFollowing 有一个 Target（用户 B）
             .WithMany(x => x.Followers)        // 这个用户可以有很多 Followers（关注他的人）
             .HasForeignKey(x => x.TargetId)    // 外键是 TargetId
             .OnDelete(DeleteBehavior.Restrict); //  防止循环依赖和级联删除
        });




        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(), // 转换为 UTC 时间存储
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // 从数据库读取时指定为 UTC 时间
        );
        // 应用转换器到所有 DateTime 属性
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}
