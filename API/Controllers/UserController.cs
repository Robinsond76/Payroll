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
        private readonly IJobsiteRepository _jobsiteRepository;
        private readonly IMapper _mapper;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;

        //constructor
        public UserController(
            IUserRepository userRepository,
            IJobsiteRepository jobsiteRepository,
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
                var userDto = new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName,
                    Manager = user.Manager,
                    Admin = user.Admin
                };

                //get last timestamp for LastJobsiteVisited
                var lastJobsiteVisited = await _timestampRepository.GetUsersLastTimestamp(user);
                if (lastJobsiteVisited != null)
                    userDto.LastJobsiteVisited = _mapper.Map<TimestampWithBasicJobsiteInfoDto>(lastJobsiteVisited);

                //check to see if currently clocked in at a jobsite
                var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
                if (currentlyClockedin != null)
                {
                    userDto.CurrentlyClockedIn = true;
                    userDto.ClockedInTimestamp = _mapper.Map<TimestampClockedInBasicDto>(currentlyClockedin);
                }
                //else
                //{
                //    userDto.CurrentlyClockedIn = false;
                //    userDto.ClockedInTimestamp = null;
                //}

                return userDto;
            }
            //else
            return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Invalid email or password" }));
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {
            //manager status
            var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
            if (loggedInUser.Manager == false)
                return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

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
                    Username = user.UserName,
                };
            };

            return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: failed to save");

        }
        
        [HttpPut("{username}")]
        public async Task<ActionResult<UserUpdateDto>> UpdateUser(string username, UserUpdateDto userUpdateValues)
        {
            try
            {
                //manager status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Manager == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

                var user = await _userRepository.GetUser(username);
                //if user not found
                if (user == null)
                    return NotFound($"Username {username} not found.");

                //validate just like in register

                //email
                if (userUpdateValues.Email != user.Email && await _userRepository.EmailExists(userUpdateValues.Email))
                    return BadRequest(new RestError(HttpStatusCode.BadRequest, new { Email = "Email already exists" }));

                //username
                if (userUpdateValues.Username != user.UserName && await _userRepository.UsernameExists(userUpdateValues.Username))
                    return BadRequest(new RestError(HttpStatusCode.BadRequest, new { Username = "This username is already registered" }));



                _mapper.Map(userUpdateValues, user);

                if (await _userRepository.UpdateUser(user))
                    return _mapper.Map<UserUpdateDto>(user);
            }
            catch (Exception err)
            {
                throw err;
                //return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to edit user");
            }
            return BadRequest();
        }

        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            try
            {
                //manager status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Manager == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));


                var user = await _userRepository.GetUser(username);
                //if user not found
                if (user == null)
                    return NotFound($"Username {username} not found.");


                await _timestampRepository.DeleteAllUserTimestamps(user);

                await _userRepository.DeleteUser(user);
                return Ok($"{username} deleted.");

            } catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to communicate with database");
            }
        }

        //Get current user's info including manager status
        [HttpGet]
        public async Task<UserDto> GetLoggedInUser()
        {
            var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
            var token = _jwtGenerator.CreateToken(user);

            var userDto = _mapper.Map<UserDto>(user);
            userDto.Token = token;

            //get last timestamp for LastJobsiteVisited
            var lastJobsiteVisited = await _timestampRepository.GetUsersLastTimestamp(user);
            if (lastJobsiteVisited != null)
                userDto.LastJobsiteVisited = _mapper.Map<TimestampWithBasicJobsiteInfoDto>(lastJobsiteVisited);

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

        //Gets any user's display name, username and login status
        //needs manager status
        [HttpGet("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            try
            {
                //manager status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Manager == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

                var user = await _userRepository.GetUser(username);

                var userInfoDto = _mapper.Map<UserInfoDto>(user);

                //get last timestamp for LastJobsiteVisited
                var lastJobsiteVisited = await _timestampRepository.GetUsersLastTimestamp(user);
                if (lastJobsiteVisited != null)
                    userInfoDto.LastJobsiteVisited = _mapper.Map<TimestampWithBasicJobsiteInfoDto>(lastJobsiteVisited);

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

        //Get all timestamps for current user - can sort by date
        [HttpGet("timestamps")]
        public async Task<ActionResult<UserInfoWithHoursWorkedDto>> GetAllUserTimestamps([FromQuery] TimestampParameters timestampParameters)
        {
            try
            {
                //code below will only run if already logged in
                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());

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

        //Get all timestamps for current user by jobsite - can sort by date
        [HttpGet("timestamps/{moniker}")]
        public async Task<ActionResult<UserInfoWithHoursWorkedDto>> GetUserTimestampsFromJobsite(string moniker, [FromQuery] TimestampParameters timestampParameters)
        {
            try
            {
                //code below will only run if already logged in
                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());

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

        //Get all users
        [HttpGet("/api/users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] PageParameters pageParameters)
        {
            try
            {
                //manager status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Manager == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

                var users = await _userRepository.GetAllUsers(pageParameters);

                var metadata = new
                {
                    users.TotalCount,
                    users.PageSize,
                    users.CurrentPage,
                    users.HasNext,
                    users.HasPrevious
                };

                //Add page info to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                return Ok(_mapper.Map<ICollection<UserGeneralInfoDto>>(users));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to query database.");
            }
        }

        //For Admin only : Get all managers
        [HttpGet("/api/managers")]
        public async Task<IActionResult> GetAllManagers([FromQuery] PageParameters pageParameters)
        {
            try
            {
                //admin status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Admin == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

                var managers = await _userRepository.GetAllManagers(pageParameters);

                var metadata = new
                {
                    managers.TotalCount,
                    managers.PageSize,
                    managers.CurrentPage,
                    managers.HasNext,
                    managers.HasPrevious
                };

                //Add page info to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                return Ok(_mapper.Map<ICollection<UserGeneralInfoDto>>(managers));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to query database.");
            }
        }

        //For Admin only : Add or Remove Manager Status
        [HttpPost("{username}")]
        public async Task<IActionResult> ManagerStatus(string username, [FromQuery] bool manager)
        {
            try
            {
                //admin status
                var loggedInUser = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());
                if (loggedInUser.Admin == false)
                    return Unauthorized(new RestError(HttpStatusCode.Unauthorized, new { Unauthorized = "Unauthorized to perform action" }));

                //find user
                var user = await _userRepository.GetUser(username);
                if (user == null)
                    return NotFound($"Username {username} not found.");

                if (manager == true)
                {
                    user.Manager = true;
                } else 
                {
                    user.Manager = false;
                }

                if (await _userRepository.UpdateUser(user))
                    return Ok();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to edit user");
            }
            return BadRequest();
        }
    }
}
