using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }

        public bool ClockedIn { get; set; }
        public DateTime ClockedInStamp { get; set; }
        public DateTime LunchStamp { get; set; }
        public DateTime ClockedOutStamp { get; set; }
    }
}
