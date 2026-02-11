using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    // [Required] 没有必要经过注解，因为 Identity 框架会自动要求密码复杂度
    public string Password { get; set; } = string.Empty;
}
