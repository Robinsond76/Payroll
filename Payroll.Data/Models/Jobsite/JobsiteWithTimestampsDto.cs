using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class JobsiteWithTimestampsDto
    {
        public string Name { get; set; }
        public string Moniker { get; set; }

        public ICollection<String> EmployeesThatClocked { get; set; }
        public ICollection<TimestampWithUserDto> Timestamps { get; set; }
    }
}
