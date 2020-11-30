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
        public DbSet<Timestamp> Timestamps { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Timestamp>(x => x.HasKey(t =>
                new {t.AppUserId, t.JobsiteId }));

            builder.Entity<Timestamp>()
                .HasOne(u => u.AppUser)
                .WithMany(t => t.Timestamps)
                .HasForeignKey(u => u.AppUserId);
            
            builder.Entity<Timestamp>()
                .HasOne(j => j.Jobsite)
                .WithMany(t => t.Timestamps)
                .HasForeignKey(j => j.JobsiteId);
        }
    }
}
