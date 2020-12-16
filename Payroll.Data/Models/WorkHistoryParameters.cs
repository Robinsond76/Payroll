using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class WorkHistoryParameters
    {
        private readonly DateTime _maxFromDate = DateTime.Now.AddDays(-30);
        
        private DateTime _fromDate = DateTime.Now.AddDays(-7);


        public DateTime FromDate
        {
            get
            {
                return _fromDate;
            }
            set
            {
                _fromDate = (value > _maxFromDate) ? value : _maxFromDate;
            }
        }
        public DateTime ToDate { get; set; } = DateTime.Now;
    }
}
