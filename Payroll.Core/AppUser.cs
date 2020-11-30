using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Core
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public ICollection<Timestamp> Timestamps { get; set; }

    }
}
