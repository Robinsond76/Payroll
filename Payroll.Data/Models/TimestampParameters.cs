using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampParameters
    {
        const int maxPageSize = 50;

        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = (value > maxPageSize) ? maxPageSize : value;
            }
        }

        public DateTime FromDate { get; set; } = System.DateTime.MinValue;
        public DateTime ToDate { get; set; } = DateTime.Now;
    }
}
