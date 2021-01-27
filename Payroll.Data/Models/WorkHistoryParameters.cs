using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class WorkHistoryParameters
    {
        private readonly DateTime _maxFromDate = DateTime.Now.AddDays(-45);
        
        private DateTime _fromDate = DateTime.Now.AddDays(-7);
        private DateTime _toDate = DateTime.Now;

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
        public DateTime ToDate {
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
