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
        public IList<KuralDto> GetAllKural();
        public IList<KuralDto> GetKuralsByKuralId(int kuralId);
        public IList<KuralDto> GetKuralsByChapterId(int chapterId);
        public IList<KuralDto> GetKuralsBySectionId(int sectionId);
        public IList<KuralDto> GetKuralsBySubSectionId(int subSectionId);
        public IList<CategoriesDto> GetAllChapters();
        public IList<CategoriesDto> GetAllSections();
        public IList<CategoriesDto> GetAllSubSections();
        public IList<CategoriesDto> GetChaptersListbySubSectionId(int subsectionId);
        public IList<CategoriesDto> GetSubSectionListbySectionId(int sectiondId);
        public IList<KuralDto> GetKuralByList(FilterListDto filterListDto);
        public PagedList<KuralDto> GetKuralPagedResults(FilterListDto filterListDto);

    }
}
