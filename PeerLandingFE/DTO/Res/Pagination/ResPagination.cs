using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.DTO.Res
{
    public class ResPagination<T>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }
        public int TotalRecords { get; set; }
        public string? OrderBy { get; set; }
        public string? OrderDirection { get; set; }
        public string NextUrl { get; set; } = "";
        public string PreviousUrl { get; set; } = "";
        public T Records { get; set; }
    }
}
