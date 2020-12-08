using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class JobsiteWithTimestampsDto
    {
        private ICollection<string> _employeesThatClocked;

        public string Name { get; set; }
        public string Moniker { get; set; }

        public ICollection<String> EmployeesThatClocked { 
            get 
            {
                ICollection<string> employees = new List<string>();

                foreach (var timestamp in this.Timestamps)
                {
                    if (employees.Contains(timestamp.DisplayName))
                        continue;
                    //else
                    employees.Add(timestamp.DisplayName);

                }
                _employeesThatClocked = employees;
                return _employeesThatClocked;
            } 
        }
        public ICollection<TimestampWithUserDto> Timestamps { get; set; }
    }
}
