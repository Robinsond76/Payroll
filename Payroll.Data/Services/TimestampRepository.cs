using Microsoft.EntityFrameworkCore;
using Payroll.Core;
using Payroll.Data.Interfaces;
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

        public async Task<Timestamp> GetClockedInTimestamp(AppUser user)
        {
            return await _db.Timestamps
                .Include(t => t.Jobsite)
                .SingleOrDefaultAsync(
                t => t.AppUserId == user.Id && t.ClockedIn == true);
        }

        public async Task<ICollection<Timestamp>> TimestampsForJobByUser(AppUser user, string moniker)
        {
            var query = _db.Timestamps
                .Include(t => t.Jobsite)
                .Where(t => 
                t.AppUser == user && 
                t.Jobsite.Moniker == moniker && 
                t.ClockedIn == false);
            return await query.ToListAsync();


                
        }
    }
}
