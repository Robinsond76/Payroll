using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampParameters
    {
        const int maxPageSize = 50;
        private DateTime _toDate = DateTime.Now;
        private int _pageSize = 10;

        public int PageNumber { get; set; } = 1;

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
        public DateTime ToDate
        {
            get
            {
                //we add an extra day here to include the timestamps from 12am to 11:59pm of the desired TO date);
                return _toDate.AddDays(1);
            }
            set
            {
                _toDate = value;
            }
        }
    }
}
