using Microsoft.AspNetCore.Identity;

namespace Domain;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    /// <summary>
    /// 简介
    /// </summary>
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
}
