using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Interfaces
{
    public interface IUserAccessor
    {
        string GetCurrentUsername();
    }
}
