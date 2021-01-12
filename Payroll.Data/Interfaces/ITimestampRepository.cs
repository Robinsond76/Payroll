using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.Helpers;
using Payroll.Data.Models;
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
        public Task<ICollection<Timestamp>> GetTimestampsForJob(Jobsite jobsite);
        public Task<PagedList<Timestamp>> GetTimestampsForJobByUser(AppUser user, string moniker, TimestampParameters timestampParameters);
        public Task<PagedList<Timestamp>> GetTimestampsForUserByDate(AppUser user, TimestampParameters timestampParameters);
        public Task<PagedList<Timestamp>> GetTimestampsForJobByDate(Jobsite jobsite, TimestampParameters timestampParameters);
        public Task<ICollection<Timestamp>> GetTimestamps();
        public Task<ICollection<Timestamp>> GetTimestamps(WorkHistoryParameters workHistoryParameters);
        public Task<PagedList<Timestamp>> GetTimestamps(TimestampParameters timestampParameters);
        public Task<ICollection<Timestamp>> TimestampsCurrentlyClockedIn();
        public Task<Timestamp> GetUsersLastTimestamp(AppUser user);
    }
}
