using Microsoft.EntityFrameworkCore;
using Payroll.Core;
using Payroll.Data.Helpers;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using Payroll.Data.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll.Data.Services
{
    public class TimestampRepository : ITimestampRepository
    {
        private readonly PayrollContext _db;

        public TimestampRepository(PayrollContext db)
        {
            _db = db;
        }

        public async Task<bool> ClockIn(Jobsite jobsite, AppUser user)
        {
            var timestamp = new Timestamp
            {
                Jobsite = jobsite,
                AppUser = user,
                ClockedIn = true,
                ClockedInStamp = DateTime.Now
            };
            _db.Timestamps.Add(timestamp);

            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<bool> ClockInLunch(AppUser user)
        {
            var clockedInTimestamp = await this.GetClockedInTimestamp(user);
            clockedInTimestamp.LunchStamp = DateTime.Now;
            
            return await _db.SaveChangesAsync() > 0;
                    
        }

        public async Task<bool> ClockOut(AppUser user)
        {
            var clockedInTimestamp = await this.GetClockedInTimestamp(user);
            clockedInTimestamp.ClockedIn = false;
            clockedInTimestamp.ClockedOutStamp = DateTime.Now;

            return await _db.SaveChangesAsync() > 0;
        }

        public async Task<ICollection<Timestamp>> GetTimestamps()
        {
            var query = _db.Timestamps
                .Include(t => t.AppUser)
                .Include(t => t.Jobsite);

            return await query.ToListAsync();
        }

        public async Task<ICollection<Timestamp>> GetTimestampsForUserByWorkDate(AppUser user,
            WorkHistoryParameters workHistoryParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.AppUser)
                .Include(t => t.Jobsite)
                .Where(t => t.AppUser == user && 
                        t.ClockedInStamp >= workHistoryParameters.FromDate &&
                        t.ClockedInStamp <= workHistoryParameters.ToDate &&
                        t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await query.ToListAsync();
        }

        public async Task<PagedList<Timestamp>> GetTimestamps(
            TimestampParameters timestampParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.AppUser)
                .Include(t => t.Jobsite)
                .Where(t => t.ClockedInStamp >= timestampParameters.FromDate && 
                        t.ClockedInStamp <= timestampParameters.ToDate &&
                        t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await PagedList<Timestamp>.ToPagedList(
                query, 
                timestampParameters.PageNumber, 
                timestampParameters.PageSize);
        }

        public async Task<ICollection<Timestamp>> GetTimestamps(WorkHistoryParameters workHistoryParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.AppUser)
                .Include(t => t.Jobsite)
                .Where(t =>
                        t.ClockedInStamp >= workHistoryParameters.FromDate &&
                        t.ClockedInStamp <= workHistoryParameters.ToDate &&
                        t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await query.ToListAsync();
        }

        public async Task<Timestamp> GetClockedInTimestamp(AppUser user)
        {
            return await _db.Timestamps
                .Include(t => t.Jobsite)
                .SingleOrDefaultAsync(
                t => t.AppUserId == user.Id && t.ClockedIn == true);
        }
        
        public async Task<bool> JobsiteHasClockedInTimestamp(Jobsite jobsite)
        {
            return await _db.Timestamps
                .Include(t => t.Jobsite)
                .AnyAsync(
                t => t.Jobsite == jobsite && t.ClockedIn == true);
        }

        public async Task<ICollection<Timestamp>> TimestampsCurrentlyClockedIn()
        {
            var query = _db.Timestamps
                .Where(t => t.ClockedIn == true)
                .Include(t => t.AppUser)
                .Include(t => t.Jobsite);

            return await query.ToListAsync();

        }

        public async Task<PagedList<Timestamp>> GetTimestampsForJobByUser(
            AppUser user, string moniker, TimestampParameters timestampParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.Jobsite)
                .Where(t =>
                t.AppUser == user &&
                t.Jobsite.Moniker == moniker &&
                t.ClockedInStamp >= timestampParameters.FromDate &&
                    t.ClockedInStamp <= timestampParameters.ToDate &&
                    t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await PagedList<Timestamp>.ToPagedList(
                query,
                timestampParameters.PageNumber,
                timestampParameters.PageSize); ;     
        }

        public async Task<PagedList<Timestamp>> GetTimestampsForUserByDate(AppUser user, TimestampParameters timestampParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.Jobsite)
                .Where(t =>
                t.AppUser == user &&
                t.ClockedInStamp >= timestampParameters.FromDate &&
                    t.ClockedInStamp <= timestampParameters.ToDate &&
                    t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await PagedList<Timestamp>.ToPagedList(
                query,
                timestampParameters.PageNumber,
                timestampParameters.PageSize);
        }

        public async Task<PagedList<Timestamp>> GetTimestampsForJobByDate(Jobsite jobsite, TimestampParameters timestampParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.AppUser)
                .Where(t => t.Jobsite == jobsite &&
                t.ClockedInStamp >= timestampParameters.FromDate &&
                t.ClockedInStamp <= timestampParameters.ToDate)
                .OrderByDescending(t => t.ClockedInStamp);

            return await PagedList<Timestamp>.ToPagedList(
                query,
                timestampParameters.PageNumber,
                timestampParameters.PageSize);
        }

        public async Task<ICollection<Timestamp>> GetTimestampsForJob(Jobsite jobsite)
        {
            return await _db.Timestamps
                .Include(t => t.AppUser)
                .Where(t => t.Jobsite == jobsite)
                .ToListAsync();
        }

        public async Task<Timestamp> GetUsersLastTimestamp(AppUser user)
        {
            var timestamp = _db.Timestamps
                .Include(t => t.Jobsite)
                .Where(t => t.AppUser == user)
                .OrderByDescending(t => t.ClockedInStamp);

            if (timestamp.Count() == 0 )
            {
                return null;
            }

            return await timestamp.FirstAsync();

        }

        public async Task<ICollection<Timestamp>> GetTimestampsUnpaged(TimestampParameters timestampParameters)
        {
            var query = _db.Timestamps
                .Include(t => t.Jobsite)
                .Where(t => t.ClockedInStamp >= timestampParameters.FromDate &&
                        t.ClockedInStamp <= timestampParameters.ToDate &&
                        t.ClockedIn == false)
                .OrderByDescending(t => t.ClockedInStamp);

            return await query.ToListAsync();
        }
    }
}
