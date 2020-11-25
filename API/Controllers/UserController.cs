using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;

        //constructor
        public UserController(UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            IMapper mapper,
            IJwtGenerator jwtGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _jwtGenerator = jwtGenerator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null)
                return Unauthorized("Incorrect username or password");

            var confirmPassword = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);

            //Return a token
            if (confirmPassword.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName
                };
            }
            return Unauthorized("Incorrect username or password.");
        }
    }
}
