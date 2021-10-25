using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tamil.Thirukkural.Models.DB;
using Tamil.Thirukkural.Models.DTO;
using Tamil.Thirukkural.Service;

namespace tamil.thirukkural.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KuralController : ControllerBase
    {

        private readonly ILogger<KuralController> _logger;

        public  IKuralService _kuralService { get; }

        private IConfiguration _configuration;

        public KuralController(ILogger<KuralController> logger,IKuralService kuralService,IConfiguration configuration)
        {
            _logger = logger;
            _kuralService = kuralService;
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetAllKurals")]
        public IActionResult Get()
        {
            try
            {
                var result = _kuralService.GetAllKural();
                return Ok(result);

            }catch(Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        [Route("GetKuralById")]
        public IActionResult GetKuralById(int kuralId)
        {
            try
            {
                var result = _kuralService.GetKuralsByKuralId(kuralId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        [Route("GetKuralsByChapterId")]
        public IActionResult GetKuralsByChapterId(int chapterId)
        {
            try
            {
                var result = _kuralService.GetKuralsByChapterId(chapterId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
        }

        [HttpGet]
        [Route("GetKuralsBySectionId")]
        public IActionResult GetKuralsBySectionId(int sectionId)
        {
            try
            {
                var result = _kuralService.GetKuralsBySectionId(sectionId);
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex);  };
        }

        [HttpGet]
        [Route("GetKuralsBySubSectionId")]
        public IActionResult GetKuralsBySubSectionId(int subSectionId)
        {
            try
            {
                var result = _kuralService.GetKuralsBySubSectionId(subSectionId);
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };
        }

        [HttpGet]
        [Route("GetChapters")]
        public IActionResult GetChapters()
        {
            try
            {
                var result = _kuralService.GetAllChapters().ToList();
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };
        }

        [HttpGet]
        [Route("GetSections")]
        public IActionResult GetSections()
        {
            try
            {
                var result = _kuralService.GetAllSections();
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };
        }

        [HttpGet]
        [Route("GetSubSections")]
        public IActionResult GetSubSections()
        {
            try
            {
                var result = _kuralService.GetAllSubSections();
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };
        }

        [HttpPost]
        [Route("KuralsByList")]
        public IActionResult PostKuralsByList([FromBody] FilterListDto filterListDto)
        {
            try
            {
                if (filterListDto == null) throw new Exception("Parameter is null");
                var result = _kuralService.GetKuralByList(filterListDto);
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };

        }

        [HttpPost]
        [Route("KuralsPageResultsByList")]
        public IActionResult PostKuralsPageResults([FromBody] FilterListDto filterListDto)
        {
            try
            {
                if (filterListDto == null) throw new Exception("Parameter is null");
                var result = _kuralService.GetKuralPagedResults(filterListDto);
                var metadata = new
                {
                    result.TotalCount,
                    result.PageSize,
                    result.CurrentPage,
                    result.TotalPages,
                    result.HasNext,
                    result.HasPrevious
                };
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));
                return Ok(result);
            }
            catch (Exception ex) { return Ok(ex); };

        }










    }
}