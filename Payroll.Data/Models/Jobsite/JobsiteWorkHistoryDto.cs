using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class JobsiteWorkHistoryDto
    {
        private double _hoursWorked;

        public string Name { get; set; }
        public string Moniker { get; set; }
        public string HoursWorked => $"{_hoursWorked:N2}";
        public double HoursWorkedDouble
        {
            set
            {
                _hoursWorked += value;
            }
        }

    }
}
