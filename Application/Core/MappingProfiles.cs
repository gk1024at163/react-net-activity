using System;
using Application.Activities.DTOs;
using Application.Profiles.DTOs;
using Domain;

namespace Application.Core;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        //源对象到目标对象的映射
        CreateMap<Domain.Activity, Domain.Activity>();//用于EditActivity中给实体赋值
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();

        //Activity到ActivityDto的映射，HostDisplayName和HostId是ActivityDto中的属性，需要从Activity的Attendees集合中找到IsHost为true的Attendee对象，并获取其User的DisplayName和Id来赋值
        CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostDisplayName,
             opt => opt.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            .ForMember(d => d.HostId, opt =>
                    opt.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));

        //活动参与者 ActivityAttendee 的属性映射到用户资料 UserProfile 的属性
        CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.User.Id))
            .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.User.Bio))
            .ForMember(d => d.ImageUrl, opt => opt.MapFrom(s => s.User.ImageUrl));

        CreateMap<Photo, PhotoDto>();
        CreateMap<User, UserProfileDto>();
        //用于EditProfile中给实体赋值,当UserProfileDto中的属性值为null时，不会覆盖User实体对象中对应的属性值
        CreateMap<UserProfileDto, User>()
        .ForMember(d => d.Id, o => o.Ignore())
        .ForMember(d => d.ImageUrl, opt => opt.Condition(src => src.ImageUrl != null))
        .ForAllMembers(opts =>
            opts.Condition((src, dest, srcMember, destMember) => srcMember != null));
    }
}
