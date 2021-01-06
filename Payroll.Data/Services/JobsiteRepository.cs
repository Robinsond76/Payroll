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
    public class JobsiteRepository : IJobsiteRepository
    {
        private readonly PayrollContext _db;

        public JobsiteRepository(PayrollContext db)
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

        public async Task<PagedList<Jobsite>> GetAllJobsitesAsync(PageParameters pageParameters)
        {
            var query = _db.Jobsites
                .Include(j => j.Location)
                .Include(j => j.Timestamps)
                .ThenInclude(t => t.AppUser)
                .OrderBy(j => j.Name);

            return await PagedList<Jobsite>.ToPagedList(
                            query,
                            pageParameters.PageNumber,
                            pageParameters.PageSize);
        }

        public async Task<Jobsite> GetJobsiteAsync(string moniker,
            bool includeTimestamps = false)
        {
            var query = _db.Jobsites
                .Include(j => j.Location)
                .Where(j => j.Moniker == moniker);

            if (includeTimestamps)
                query = query
                .Include(j => j.Timestamps)
                .ThenInclude(t => t.AppUser);
                
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

        public async Task<int> GetJobsiteIdByMoniker(string moniker)
        {
            try
            {
                var query = await _db.Jobsites.FirstOrDefaultAsync(t => t.Moniker == moniker);
                return query.JobsiteId;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public async Task<PagedList<Jobsite>> SearchJobsites(string searchQuery, 
            PageParameters pageParameters)
        {
            var query = from j in _db.Jobsites
                        select j;

            if (!String.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(j =>
                            j.Name.Contains(searchQuery) ||
                            j.Moniker.Contains(searchQuery));
            }

            query = query.Include(j => j.Location).OrderBy(j => j.Moniker);

            return await PagedList<Jobsite>.ToPagedList(
                query, 
                pageParameters.PageNumber, 
                pageParameters.PageSize);
        }
    }
}
