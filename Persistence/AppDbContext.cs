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
