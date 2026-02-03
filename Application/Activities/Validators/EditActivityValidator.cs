using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public class EditActivityValidator
: BaseActivityValidator<EditActivity.Command, EditActivityDto>
{
    public EditActivityValidator() : base(x => x.EditActivityDto)
    {
        RuleFor(x => x.EditActivityDto.Id).NotEmpty()
        .WithMessage("Activity ID is required");
    }
}