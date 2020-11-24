using Microsoft.EntityFrameworkCore;
using Payroll.Core;
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
    public class PayrollRepository : IPayrollRepository
    {
        private readonly PayrollContext _db;

        public PayrollRepository(PayrollContext db)
        {
            _db = db;
        }

        public void Add<T>(T entity) where T : class
        {
            _db.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _db.Remove(entity);
        }

        public async Task<List<Jobsite>> GetAllJobsitesAsync()
        {
            var query = _db.Jobsites
                .Include(j => j.Location)
                .OrderBy(j => j.Name);

            return await query.ToListAsync(); ;
        }


        public async Task<Jobsite> GetJobsiteAsync(string moniker)
        {
            var query = _db.Jobsites
                .Include(j => j.Location)
                .Where(j => j.Moniker == moniker);
                
            return await query.FirstOrDefaultAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _db.SaveChangesAsync()) > 0;
        }

        public async Task<bool> JobsiteExistsAsync(string moniker)
        {
            return await _db.Jobsites.AnyAsync(jobsite => jobsite.Moniker == moniker);
        }
    }
}
