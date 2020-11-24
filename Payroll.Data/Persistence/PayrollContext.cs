using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Persistence
{
    public class PayrollContext : IdentityDbContext<AppUser>
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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
