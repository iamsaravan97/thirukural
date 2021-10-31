using AutoMapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamil.Thirukkural.Models.Common;
using Tamil.Thirukkural.Models.DB;
using Tamil.Thirukkural.Models.DTO;

namespace Tamil.Thirukkural.Service
{
    public class KuralService : IKuralService
    {
        private ThirukkuralContext _kuralContext;
        private readonly IMapper _mapper;
        private IConfiguration _configration;

        public KuralService(IConfiguration configuration,IMapper mapper)
        {
            _configration = configuration;
            _kuralContext = new ThirukkuralContext(_configration);
            _mapper = mapper;
          
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

        public IList<KuralDto> GetAllKural()
        {
            var retrieveddata = _kuralContext.Kurals.OrderBy(x=>x.KuralId).ToList();
            if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            var result = _mapper.Map<List<KuralDto>>(retrieveddata);
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            result.ForEach(ele =>
            {
                var splitengexp = ele.Transliteration.Split(' ');
                ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
            });
            return result;
        }

        public IList<KuralDto> GetKuralsByChapterId(int chapterId)
        {
            var retrieveddata = _kuralContext.Kurals.Where(x=>x.ChapterId == chapterId).ToList();
            if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            var result = _mapper.Map<List<KuralDto>>(retrieveddata);
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            result.ForEach(ele =>
            {
                var splitengexp = ele.Transliteration.Split(' ');
                ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
            });
            return result;
        }

        public IList<KuralDto> GetKuralsByKuralId(int kuralId)
        {
            var retrieveddata = _kuralContext.Kurals.Where(x => x.KuralId == kuralId).ToList();
            if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            var result = _mapper.Map<List<KuralDto>>(retrieveddata);
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            result.ForEach(ele =>
            {
                var splitengexp = ele.Transliteration.Split(' ');
                ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
            });
            return result;
        }

        public IList<KuralDto> GetKuralsBySectionId(int sectionId)
        {
            var retrieveddata = _kuralContext.Kurals.Where(x => x.SectionId == sectionId).ToList();
            if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            var result = _mapper.Map<List<KuralDto>>(retrieveddata);
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            result.ForEach(ele =>
            {
                var splitengexp = ele.Transliteration.Split(' ');
                ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
            });
            return result;
        }

        public IList<KuralDto> GetKuralsBySubSectionId(int subSectionId)
        {

            var retrieveddata = _kuralContext.Kurals.Where(x => x.CgId == subSectionId).ToList();
            if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            var result = _mapper.Map<List<KuralDto>>(retrieveddata);
            if (result == null) throw new Exception("Error in retrieve kurals. Please contact developers");
            result.ForEach(ele =>
            {
                var splitengexp = ele.Transliteration.Split(' ');
                ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
            });
            return result;
        }

        public IList<KuralDto> GetKuralByList(FilterListDto filterListDto)
        {
            var KuralsList = new List<KuralDto>();

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
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.ChapterId == categoryId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            //by subsection
            if (filterListDto.SubSectionIds.Count != 0)
            {
                filterListDto.SubSectionIds.ForEach(subsectionId =>
                {
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.CgId == subsectionId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            //by section
            if (filterListDto.SectionIds.Count != 0)
            {
                filterListDto.SectionIds.ForEach(sectionId =>
                {
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.SectionId == sectionId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact developers");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    if (result == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            return KuralsList.GroupBy(x=>x.KuralId).Select(x=>x.First()).OrderBy(x=>x.KuralId).ToList();

        }

        public PagedList<KuralDto> GetKuralPagedResults(FilterListDto filterListDto)
        {
            var KuralsList = new List<KuralDto>();

            if (filterListDto == null)
            {
                throw new Exception("Parameter is empty");
            }

            //
            if (filterListDto.ChapterIds.Count == 0 && filterListDto.SectionIds.Count == 0 &&
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
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.ChapterId == categoryId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            //by subsection
            if (filterListDto.SubSectionIds.Count != 0)
            {
                filterListDto.SubSectionIds.ForEach(subsectionId =>
                {
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.CgId == subsectionId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            //by section
            if (filterListDto.SectionIds.Count != 0)
            {
                filterListDto.SectionIds.ForEach(sectionId =>
                {
                    var retrieveddata = _kuralContext.Kurals.Where(x => x.SectionId == sectionId).ToList();
                    if (retrieveddata == null) throw new Exception("Error in retrieve kurals. Please contact admin");
                    var result = _mapper.Map<List<KuralDto>>(retrieveddata);
                    result.ForEach(ele =>
                    {
                        var splitengexp = ele.Transliteration.Split(' ');
                        ele.TransFirstLine = string.Join(" ", splitengexp.Take(4).ToList());
                        ele.TransSecondLine = string.Join(" ", splitengexp.TakeLast(3).ToList());
                    });
                    KuralsList.AddRange(result);
                });
            }

            var resultlist =  PagedList<KuralDto>.ToPagedList(KuralsList.Distinct().OrderBy(x => x.KuralId).ToList(),
           filterListDto.PageNumber,
           filterListDto.PageSize);

            return resultlist;

        }
    }
}
