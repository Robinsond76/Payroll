using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Payroll.Data.Models
{
   public class UserRegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [StringLength( 10, 
            ErrorMessage = "Username must be between 3 and 10 characters long", 
            MinimumLength = 3)]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(8, ErrorMessage = "Password must but a minimum of 8 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
         ErrorMessage = "Password Requires: 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol")]
        public string Password { get; set; }
    }
}
