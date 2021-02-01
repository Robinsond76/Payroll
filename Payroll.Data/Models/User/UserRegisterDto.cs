using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Payroll.Data.Models
{
    public class UserRegisterDto
    {

        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserValidator : AbstractValidator<UserRegisterDto>
    {
        public UserValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.Username)
                .NotEmpty()
                .Matches(@"^[\S]+$")
                .WithMessage("Spaces in username not allowed.");
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must contain at least 8 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least 1 uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain at least 1 lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least 1 number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain non alphanumeric");
        }
    }

}
