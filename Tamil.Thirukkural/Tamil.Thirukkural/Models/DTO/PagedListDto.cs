using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tamil.Thirukkural.Models.DTO
{
    public class PagedListDto<T>
    {
        public List<T> Items;
        public int TotalCount;
    }
}
