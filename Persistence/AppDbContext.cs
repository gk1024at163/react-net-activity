using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext(DbContextOptions options)
: IdentityDbContext<User>(options)
{
    public required DbSet<Activity> Activities { get; set; }
    //4. 配置多对多关系
    public required DbSet<ActivityAttendee> ActivityAttendees { get; set; }

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
    }
}
