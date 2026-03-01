using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class UserAccessor(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext dbContext) : IUserAccessor
{
    /* 需要访问IHttpContextAccessor,因为用户对象就在那里，所以需要访问
    */
    public async Task<User> GetUserAsync()
    {
        return await dbContext.Users
            .FindAsync(GetUserId())
            ?? throw new UnauthorizedAccessException("No user logged in");
    }

    public string GetUserId()
    {
        return httpContextAccessor.HttpContext?
                .User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new Exception("User not found");
    }

    public async Task<User> GetUserWithPhotosAsync()
    {
        return await dbContext.Users
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Id == GetUserId())
            ?? throw new UnauthorizedAccessException("No user logged in");
    }
}
