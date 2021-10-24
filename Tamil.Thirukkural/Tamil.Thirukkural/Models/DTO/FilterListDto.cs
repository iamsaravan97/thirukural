using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Tamil.Thirukkural.Models.DTO
{
    [DataContract]
    public class FilterListDto
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public List<int> ChapterIds { get; set; }

        [DataMember]
        public List<int> SectionIds { get; set; }

        [DataMember]
        public List<int> SubSectionIds{ get; set; }
    }
}
