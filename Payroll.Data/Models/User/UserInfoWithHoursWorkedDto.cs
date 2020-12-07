using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserInfoWithHoursWorkedDto
    {
        private string totalHoursWorked;

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string TotalHoursWorked { 
            get 
            {
                double hoursWorked = 0;
                foreach(var timestamp in this.Timestamps)
                {
                    var span = timestamp.ClockedOutStamp - timestamp.ClockedInStamp;
                    hoursWorked += span.TotalHours;
                }
                totalHoursWorked = $"{hoursWorked:N2}";
                return totalHoursWorked;
            } 
        }
        public ICollection<TimestampWithJobsiteDto> Timestamps { get; set; }
    }
}
