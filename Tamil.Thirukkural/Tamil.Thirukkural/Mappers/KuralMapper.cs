using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamil.Thirukkural.Models.DB;
using Tamil.Thirukkural.Models.DTO;

namespace Tamil.Thirukkural.Mappers
{
    public class KuralMapper : Profile
    {
        public KuralMapper()
        {
            CreateMap<Kural, KuralDto>();
        }
    }
}
