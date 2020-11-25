using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Payroll.Core;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using Payroll.Data.Persistence;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Payroll.Data.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly PayrollContext _db;

        public UserRepository(UserManager<AppUser> userManager,
            PayrollContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _db.Users.AnyAsync(user => user.Email == email);
        }

        public async Task<bool> UsernameExists(string username)
        {
            return await _db.Users.AnyAsync(user => user.UserName == username);
        }

    }
}
