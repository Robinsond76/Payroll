using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Core
{
    public class Timestamp
    {
        public int TimestampId { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public int JobsiteId { get; set; }
        public Jobsite Jobsite { get; set; }

        public bool ClockedIn { get; set; }
        public DateTimeOffset ClockedInStamp { get; set; }
        public DateTimeOffset LunchStamp { get; set; }
        public DateTimeOffset ClockedOutStamp { get; set; }

    }
}
