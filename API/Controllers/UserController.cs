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

        [HttpGet("{username}/timestamps")]
        public async Task<IActionResult> GetAllTimeStamps(string username, string fromDate, string toDate)
        {
            try
            {
                var user = await _userRepository.GetUser(username, true);

                //NotFound() if user not found
                if (user == null)
                    return NotFound($"Username {username}not found.");

                // if only 'fromDate' is provided
                if (fromDate != null && toDate == null)
                {
                    DateTime fromDateTime;
                    try
                    {
                        fromDateTime = DateTime.Parse(fromDate);
                    }
                    catch (Exception)
                    {
                        return BadRequest("Error: Date query should be in the following format: MM/DD/YYYY");
                    }

                    var filteredTimestamps = user.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime && t.ClockedIn == false).ToList();

                    user.Timestamps = filteredTimestamps;

                    var userWithFilteredTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                    return Ok(userWithFilteredTimestamps);
                }

                //if both dates provided
                if (fromDate != null && toDate != null)
                {
                    DateTime fromDateTime;
                    DateTime toDateTime;
                    try
                    {
                        fromDateTime = DateTime.Parse(fromDate);
                        toDateTime = DateTime.Parse(toDate);
                    }
                    catch (Exception)
                    {
                        return BadRequest("Error: Date query should be in the following format: MM/DD/YYYY");
                    }

                    //BadRequest() if fromdate is past todate
                    if (fromDateTime > toDateTime)
                        return BadRequest("'From Date' cannot be past 'To Date'");

                    var filteredTimestamps = user.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime &&
                        t.ClockedInStamp <= toDateTime &&
                        t.ClockedIn == false).ToList();

                    user.Timestamps = filteredTimestamps;

                    var userWithFilteredTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                    return Ok(userWithFilteredTimestamps);
                }

                //return all timestamps if no date provided
                var TimestampsNotClockedIn = user.Timestamps.Where(t => t.ClockedIn == false).ToList();
                user.Timestamps = TimestampsNotClockedIn;

                var userWithTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                return Ok(userWithTimestamps);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve user data");
            }
        }

        [HttpGet("{username}/timestamps/{moniker}")]
        public async Task<ActionResult<UserInfoWithHoursWorkedDto>> GetUserTimestampsFromJobsite(string username, 
            string moniker, string fromDate, string toDate)
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

                //filter user's timestamps by jobsite
                var filteredTimestamps = await _timestampRepository.TimestampsForJobByUser(user, moniker);
                user.Timestamps = filteredTimestamps;

                //if only fromDate is provided
                if (fromDate != null && toDate == null)
                {
                    DateTime fromDateTime;
                    try
                    {
                        fromDateTime = DateTime.Parse(fromDate);
                    }
                    catch (Exception)
                    {
                        return BadRequest("Error: Date query should be in the following format: MM/DD/YYYY");
                    }

                    var filteredTimestampsByDate = user.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime && t.ClockedIn == false).ToList();

                    user.Timestamps = filteredTimestampsByDate;

                    var userWithFilteredTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                    return Ok(userWithFilteredTimestamps);
                }

                //if both dates provided
                if (fromDate != null && toDate != null)
                {
                    DateTime fromDateTime;
                    DateTime toDateTime;
                    try
                    {
                        fromDateTime = DateTime.Parse(fromDate);
                        toDateTime = DateTime.Parse(toDate);
                    }
                    catch (Exception)
                    {
                        return BadRequest("Error: Date query should be in the following format: MM/DD/YYYY");
                    }

                    //BadRequest() if fromdate is past todate
                    if (fromDateTime > toDateTime)
                        return BadRequest("'From Date' cannot be past 'To Date'");

                    var filteredTimestampsByDate = user.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime &&
                        t.ClockedInStamp <= toDateTime &&
                        t.ClockedIn == false).ToList();

                    user.Timestamps = filteredTimestampsByDate;

                    var userWithFilteredTimestamps = _mapper.Map<UserInfoWithHoursWorkedDto>(user);
                    return Ok(userWithFilteredTimestamps);
                }

                //if no dates provided
                return Ok(_mapper.Map<UserInfoWithHoursWorkedDto>(user));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to query database.");
            }
        }
    }
}
