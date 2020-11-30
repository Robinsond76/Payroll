using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Persistence
{
    public class PayrollContext : DbContext
    {
        private readonly IConfiguration _config;

        public PayrollContext(DbContextOptions options, IConfiguration config) : base(options)
        {
            _config = config;

        }

        public DbSet<Jobsite> Jobsites { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
        }
g    }
}
