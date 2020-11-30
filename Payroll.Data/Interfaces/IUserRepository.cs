using Microsoft.AspNetCore.Identity;
using Payroll.Core;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Payroll.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> EmailExists(string email);
        Task<bool> UsernameExists(string username);
    }
}
