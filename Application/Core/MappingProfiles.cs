using System;

namespace Application.Core;

public class MappingProfiles : AutoMapper.Profile
{
    public MappingProfiles()
    {
        //源对象到目标对象的映射
        CreateMap<Domain.Activity, Domain.Activity>();//用于EditActivity中给实体赋值
    }
}
