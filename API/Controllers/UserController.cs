using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;

        //constructor
        public UserController(UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            IUserRepository userRepository,
            IMapper mapper,
            IJwtGenerator jwtGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userRepository = userRepository;
            _mapper = mapper;
            _jwtGenerator = jwtGenerator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user == null)
                return Unauthorized("Incorrect username or password");

            var confirmPassword = await _signInManager.CheckPasswordSignInAsync(user, userLoginDto.Password, false);

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

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {
            if (await _userRepository.EmailExists(userRegisterDto.Email))
                return BadRequest(new { Email = "This email is already registered" });
            
            if (await _userRepository.UsernameExists(userRegisterDto.Username))
                return BadRequest(new { Username = "This username is already registered" });

            var user = _mapper.Map<AppUser>(userRegisterDto);
            var saveUser = await _userManager.CreateAsync(user, userRegisterDto.Password);

            if (saveUser.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName
                };
            };

            return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: failed to save");

        }

    }
}
