using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class TimestampClockedInDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Jobsite { get; set; }
        public string Moniker { get; set; }

        public DateTimeOffset ClockedInStamp { get; set; }
        public DateTimeOffset LunchStamp { get; set; }
    }
}
