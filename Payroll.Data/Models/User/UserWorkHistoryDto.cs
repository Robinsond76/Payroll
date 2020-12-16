using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserWorkHistoryDto
    {
        private double _hoursWorked;

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string TotalHoursWorked => $"{_hoursWorked:N2}";
        public double HoursWorked { set { _hoursWorked += value; } }
        public ICollection<JobsiteWorkHistoryDto> JobsitesClocked { get; set; }
    }
}
