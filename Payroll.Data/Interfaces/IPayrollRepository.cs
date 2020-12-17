using Payroll.Core;
using Payroll.Data.Helpers;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Payroll.Data.Interfaces
{
    public interface IPayrollRepository
    {
        // General 
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();

        //Jobsites
        Task<PagedList<Jobsite>> GetAllJobsitesAsync(PageParameters pageParameters);
        Task<Jobsite> GetJobsiteAsync(string moniker, bool includeTimestamps = false);
        Task<bool> JobsiteExistsAsync(string moniker);
        Task<int> GetJobsiteIdByMoniker(string moniker);

    }
}
