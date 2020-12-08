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
                string employee = "";

                foreach (var timestamp in this.Timestamps)
                {
                    var x = timestamp.DisplayName;
                    
                    if (employee != x)
                    {
                        employee = x;
                        employees.Add(employee);
                    } else
                    {
                        continue;
                    }
                }
                _employeesThatClocked = employees;
                return _employeesThatClocked;
            } 
        }
        public ICollection<TimestampWithUserDto> Timestamps { get; set; }
    }
}
