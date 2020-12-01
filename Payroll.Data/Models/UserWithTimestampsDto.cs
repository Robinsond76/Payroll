using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserWithTimestampsDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public ICollection<TimestampDto> Timestamps { get; set; }
    }
}
