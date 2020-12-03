using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Payroll.Data.Interfaces
{
    public interface ITimestampRepository
    {
        public Task<Timestamp> GetClockedInTimestamp(AppUser user);
        public Task<bool> ClockIn(Jobsite jobsite, AppUser user);
        public Task<bool> ClockInLunch(AppUser user);
        public Task<bool> ClockOut(AppUser user);
    }
}
