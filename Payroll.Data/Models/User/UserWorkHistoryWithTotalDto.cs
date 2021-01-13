using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserWorkHistoryWithTotalDto
    {
        private double _hoursWorked;

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string TotalHoursWorked
        {
            get
            {
                foreach (var history in this.workHistory)
                {
                    _hoursWorked += history._hoursWorked;
                }
                var totalHoursWorked = $"{_hoursWorked:N2}";
                return totalHoursWorked;
            }
        }
        public ICollection<JobsiteWorkHistoryDto> workHistory { get; set; }
    }
}
