using Payroll.Core;
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
        Task<List<Jobsite>> GetAllJobsitesAsync();
        Task<Jobsite> GetJobsiteAsync(string moniker);
        Task<bool> JobsiteExistsAsync(string moniker);

    }
}
