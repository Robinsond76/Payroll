using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Payroll.Core;
using Payroll.Data.Errors;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IPayrollRepository _jobsiteRepository;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;

        //constructor
        public UserController(
            IUserRepository userRepository,
            IPayrollRepository jobsiteRepository,
            IMapper mapper,
            IJwtGenerator jwtGenerator,
            IUserAccessor userAccessor,
            ITimestampRepository timestampRepository)
        {
            _userRepository = userRepository;
            _jobsiteRepository = jobsiteRepository;
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
                return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new {Unauthorized = "Invalid email or password" }));

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
            return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Invalid email or password" }));
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {
            if (await _userRepository.EmailExists(userRegisterDto.Email))
                return BadRequest(new RestError(HttpStatusCode.BadRequest, new { Email = "Email already exists" }));

            if (await _userRepository.UsernameExists(userRegisterDto.Username))
                return BadRequest(new RestError(HttpStatusCode.BadRequest, new { Username = "This username is already registered" }));
            
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

            //check to see if currently clocked in at a jobsite
            var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
            if (currentlyClockedin != null)
            {
                userDto.CurrentlyClockedIn = true;
                userDto.ClockedInTimestamp = _mapper.Map<TimestampClockedInBasicDto>(currentlyClockedin);
            } else
            {
                userDto.CurrentlyClockedIn = false;
                userDto.ClockedInTimestamp = null;
            }

            return userDto;
        }

        //Get's a user's display name, user name and login status
        [HttpGet("{username}")]
        public async Task<IActionResult> CurrentUserInfo(string username)
        {
            try
            {
                var user = await _userRepository.GetUser(username);

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

        //Get all timestamps from a user - can sort by date
        [HttpGet("{username}/timestamps")]
        public async Task<ActionResult<UserInfoWithHoursWorkedDto>> GetAllTimeStamps(string username, [FromQuery] TimestampParameters timestampParameters)
        {
            try
            {
                var user = await _userRepository.GetUser(username);

                //NotFound() if user not found
                if (user == null)
                    return NotFound($"Username {username} not found.");

                //Get timestamps by date
                var filteredTimestamps = await _timestampRepository.GetTimestampsForUserByDate(user, timestampParameters);
                user.Timestamps = filteredTimestamps;

                //Create MetaData
                var metadata = new
                {
                    filteredTimestamps.TotalCount,
                    filteredTimestamps.PageSize,
                    filteredTimestamps.CurrentPage,
                    filteredTimestamps.HasNext,
                    filteredTimestamps.HasPrevious
                };

                //Add metadata to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                var userWithTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                return Ok(userWithTimestamps);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve user data");
            }
        }

        //Get all timestamps from a user by jobsite - can sort by date
        [HttpGet("{username}/timestamps/{moniker}")]
        public async Task<ActionResult<UserInfoWithHoursWorkedDto>> GetUserTimestampsFromJobsite(string username, 
            string moniker, [FromQuery] TimestampParameters timestampParameters)
        {
            try
            {
                var user = await _userRepository.GetUser(username);

                //error if user not found
                if (user == null)
                    return NotFound($"Error: user '{username}' not found");

                //error if jobsite not found
                var jobsiteId = await _jobsiteRepository.GetJobsiteIdByMoniker(moniker);
                if (jobsiteId == 0)
                    return NotFound($"Error: jobsite '{moniker}' not found");

                //filter user's timestamps by jobsite & date
                var filteredTimestamps = await _timestampRepository
                    .GetTimestampsForJobByUser(user, moniker, timestampParameters);

                //add the timestamps to the user object
                user.Timestamps = filteredTimestamps;

                //Create MetaData
                var metadata = new
                {
                    filteredTimestamps.TotalCount,
                    filteredTimestamps.PageSize,
                    filteredTimestamps.CurrentPage,
                    filteredTimestamps.HasNext,
                    filteredTimestamps.HasPrevious
                };

                //Add metadata to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                return Ok(_mapper.Map<UserInfoWithHoursWorkedDto>(user));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to query database.");
            }
        }
    }
}
