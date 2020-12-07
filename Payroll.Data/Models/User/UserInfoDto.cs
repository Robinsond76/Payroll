using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserInfoDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public bool CurrentlyClockedIn { get; set; }
        public string ClockedInAtJobsite { get; set; }
    }
}
