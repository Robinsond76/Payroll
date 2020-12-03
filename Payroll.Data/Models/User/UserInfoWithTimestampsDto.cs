using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserInfoWithTimestampsDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public ICollection<TimestampWithJobsiteDto> Timestamps { get; set; }
    }
}
