using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}
