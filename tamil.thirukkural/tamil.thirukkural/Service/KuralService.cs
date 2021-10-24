using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamil.Thirukkural.Models.DB;
using Tamil.Thirukkural.Models.DTO;

namespace Tamil.Thirukkural.Service
{
    public class KuralService : IKuralService
    {
        private ThirukkuralContext _kuralContext;
        private IConfiguration _configration;

        public KuralService(IConfiguration configuration)
        {
            _configration = configuration;
            _kuralContext = new ThirukkuralContext(_configration);
          
        }

        public IList<CategoriesDto> GetAllChapters()
        {

            var result = _kuralContext.Kurals.ToList().OrderBy(x=>x.ChapterId).GroupBy(x => x.ChapterId)
                .Select(g => new CategoriesDto()
                {
                    Id = g.Key,
                    Name = g.FirstOrDefault().Chapter,
                    Count = g.Count()
                }).ToList();
            if (result == null) throw new Exception("Error in retrieve List. Please contact developers");
            return result;
        }

        public IList<CategoriesDto> GetAllSections()
        {

            var result = _kuralContext.Kurals.ToList().OrderBy(x => x.SectionId).GroupBy(x => x.SectionId)
                .Select(g => new CategoriesDto()
                {
                    Id = g.Key,
                    Name = g.FirstOrDefault().Section,
                    Count = g.Count()
                }).ToList();
            if (result == null) throw new Exception("Error in retrieve List. Please contact developers");
            return result;
        }

        public IList<CategoriesDto> GetAllSubSections()
        {
            var result = _kuralContext.Kurals.ToList().OrderBy(x => x.CgId).GroupBy(x => x.CgId)
           .Select(g => new CategoriesDto()
           {
               Id = g.Key,
               Name = g.FirstOrDefault().Cg,
               Count = g.Count()
           }).ToList();
            if (result == null) throw new Exception("Error in retrieve List. Please contact developers");
            return result;
        }

        public IList<Kural> GetAllKural()
        {
            var result = _kuralContext.Kurals.OrderBy(x=>x.KuralId).ToList();
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            return result;
        }

        public IList<Kural> GetKuralsByChapterId(int chapterId)
        {
            var result = _kuralContext.Kurals.Where(x=>x.ChapterId == chapterId).ToList();
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            return result;
        }

        public IList<Kural> GetKuralsByKuralId(int kuralId)
        {
            var result = _kuralContext.Kurals.Where(x => x.KuralId == kuralId).ToList();
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            return result;
        }

        public IList<Kural> GetKuralsBySectionId(int sectionId)
        {
            var result = _kuralContext.Kurals.Where(x => x.SectionId == sectionId).ToList();
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            return result;
        }

        public IList<Kural> GetKuralsBySubSectionId(int subSectionId)
        {
            var result = _kuralContext.Kurals.Where(x => x.CgId == subSectionId).ToList();
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            return result;
        }

        public IList<Kural> GetKuralByList(FilterListDto filterListDto)
        {
            var KuralsList = new List<Kural>();

            if(filterListDto == null)
            {
                throw new Exception("Parameter is empty");
            }

            //
            if(filterListDto.ChapterIds.Count == 0 && filterListDto.SectionIds.Count == 0 &&
                filterListDto.SubSectionIds.Count == 0)
            {
                var result = GetAllKural();
                KuralsList.AddRange(result);
            }
            //by categories
            if (filterListDto.ChapterIds.Count != 0)
            {
                filterListDto.ChapterIds.ForEach(categoryId =>
                {
                    var result = _kuralContext.Kurals.Where(x => x.ChapterId == categoryId).ToList();
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    KuralsList.AddRange(result);
                });
            }

            //by subsection
            if (filterListDto.SubSectionIds.Count != 0)
            {
                filterListDto.SubSectionIds.ForEach(subsectionId =>
                {
                    var result = _kuralContext.Kurals.Where(x => x.CgId == subsectionId).ToList();
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    KuralsList.AddRange(result);
                });
            }

            //by section
            if (filterListDto.SectionIds.Count != 0)
            {
                filterListDto.SectionIds.ForEach(sectionId =>
                {
                    var result = _kuralContext.Kurals.Where(x => x.SectionId == sectionId).ToList();
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    KuralsList.AddRange(result);
                });
            }

            return KuralsList.Distinct().OrderBy(x=>x.KuralId).ToList();

        }
    }
}
