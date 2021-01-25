using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.Models
{
    public class UserUpdateDto
    {

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }

    public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.Username).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }

}