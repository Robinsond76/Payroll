using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class WorkHistoryParameters
    {
        private readonly DateTimeOffset _maxFromDate = DateTimeOffset.Now.AddDays(-45);
        
        private DateTimeOffset _fromDate = DateTimeOffset.Now.AddDays(-7);
        private DateTimeOffset _toDate = DateTimeOffset.Now;

        public DateTimeOffset FromDate
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
        public DateTimeOffset ToDate {
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
