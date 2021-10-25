using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamil.Thirukkural.Models.Common;
using Tamil.Thirukkural.Models.DB;
using Tamil.Thirukkural.Models.DTO;

namespace Tamil.Thirukkural.Service
{
    public interface IKuralService
    {
        public IList<Kural> GetAllKural();
        public IList<Kural> GetKuralsByKuralId(int kuralId);
        public IList<Kural> GetKuralsByChapterId(int chapterId);
        public IList<Kural> GetKuralsBySectionId(int sectionId);
        public IList<Kural> GetKuralsBySubSectionId(int subSectionId);
        public IList<CategoriesDto> GetAllChapters();
        public IList<CategoriesDto> GetAllSections();
        public IList<CategoriesDto> GetAllSubSections();

        public IList<Kural> GetKuralByList(FilterListDto filterListDto);

        public PagedList<Kural> GetKuralPagedResults(FilterListDto filterListDto);




    }
}
