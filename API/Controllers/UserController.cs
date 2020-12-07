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
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;

        //constructor
        public UserController(
            IUserRepository userRepository,
            IMapper mapper,
            IJwtGenerator jwtGenerator,
            IUserAccessor userAccessor,
            ITimestampRepository timestampRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _jwtGenerator = jwtGenerator;
            _userAccessor = userAccessor;
            _timestampRepository = timestampRepository;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto userLoginDto)
        {
            var user = await _userRepository.GetUserByEmail(userLoginDto.Email);
            if (user == null)
                return Unauthorized("Incorrect username or password");

            var passwordConfirmed = await _userRepository.ConfirmPassword(user, userLoginDto.Password);

            //Return a token
            if (passwordConfirmed)
            {
                return new UserDto
                { 
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName
                };
            }
            //else
            return Unauthorized("Incorrect username or password.");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {
            if (await _userRepository.EmailExists(userRegisterDto.Email))
                return BadRequest(new { Email = "This email is already registered" });
            
            if (await _userRepository.UsernameExists(userRegisterDto.Username))
                return BadRequest(new { Username = "This username is already registered" });

            var user = _mapper.Map<AppUser>(userRegisterDto);
            var userSaved = await _userRepository.SaveNewUser(user, userRegisterDto.Password);

            if (userSaved)
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

        [HttpGet]
        public async Task<UserDto> GetLoggedInUser()
        {
            var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
            var token = _jwtGenerator.CreateToken(user);

            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = token;
            return userDto;
        }

        [HttpGet("Current")]
        public async Task<IActionResult> CurrentUserInfo(bool includeTimestamps = false)
        {
            try
            {
                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername(), includeTimestamps);

                if (includeTimestamps)
                {
                    var userWithTimestamps = _mapper.Map<UserInfoWithTimestampsDto>(user);
                    return Ok(userWithTimestamps);
                }

                var userInfoDto = _mapper.Map<UserInfoDto>(user);

                //check to see if currently clocked in at a jobsite
                var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
                if (currentlyClockedin != null)
                {
                    userInfoDto.CurrentlyClockedIn = true;
                    userInfoDto.ClockedInAtJobsite = currentlyClockedin.Jobsite.Moniker;
                    return Ok(userInfoDto);
                }

                return Ok(userInfoDto);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to search database.");
            }
        }

    }
}
