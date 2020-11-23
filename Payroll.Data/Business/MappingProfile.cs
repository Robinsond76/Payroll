using AutoMapper;
using Payroll.Core;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Business
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Jobsite, JobsiteDto>().ReverseMap();
            CreateMap<Location, LocationDto>().ReverseMap();
                //.ForMember(j => j.Address1, o => o.MapFrom(m => m.Location.Address1))
                //.ForMember(j => j.Address2, o => o.MapFrom(m => m.Location.Address2))
                //.ForMember(j => j.Address3, o => o.MapFrom(m => m.Location.Address3))
                //.ForMember(j => j.CityTown, o => o.MapFrom(m => m.Location.CityTown))
                //.ForMember(j => j.StateProvince, o => o.MapFrom(m => m.Location.StateProvince))
                //.ForMember(j => j.PostalCode, o => o.MapFrom(m => m.Location.PostalCode))
                //.ForMember(j => j.Country, o => o.MapFrom(m => m.Location.Country));
        }
    }
}
