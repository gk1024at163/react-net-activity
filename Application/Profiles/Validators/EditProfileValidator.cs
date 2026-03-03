using System;
using Application.Profiles.Commands;
using Application.Profiles.DTOs;
using FluentValidation;

namespace Application.Profiles.Validators;

public class EditProfileValidator
: AbstractValidator<EditProfile.Command>
{
    public EditProfileValidator()
    {
        RuleFor(x => x.UserProfileDto.DisplayName).NotEmpty()
        .WithMessage("Display Name is required");
    }
}
