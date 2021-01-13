using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Payroll.Core;
using Payroll.Data.Helpers;
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
    public class TimestampsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ITimestampRepository _timestampRepository;
        private readonly IUserRepository _userRepository;

        //constructor
        public TimestampsController(IMapper imapper, ITimestampRepository timestampRepository, IUserRepository userRepository)
        {
            _mapper = imapper;
            _timestampRepository = timestampRepository;
            _userRepository = userRepository;
        }

        [HttpGet("info")]
        public async Task<ActionResult<object>> TimestampInfo()
        {
            var timestamps = await _timestampRepository.GetTimestamps();
            var employeeCount = TimestampActions.UniqueEmployeeCount(timestamps);
            var jobsitesCount = TimestampActions.UniqueJobsiteCount(timestamps);

            var dto = new
            {
                TotalTimestamps = timestamps.Count,
                TotalUniqueEmployees = employeeCount,
                TotalUniqueJobsites = jobsitesCount
            };

            return Ok(dto);
        }

        [HttpGet]
        public async Task<IActionResult> GetTimestamps(
            [FromQuery] TimestampParameters timestampParameters)
        {
            //returns a paged list
            var timestamps = await _timestampRepository.GetTimestamps(timestampParameters);

            var metadata = new
            {
               timestamps.TotalCount,
               timestamps.PageSize,
               timestamps.CurrentPage,
               timestamps.HasNext,
               timestamps.HasPrevious
            };

            //Add page info to header
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

            return Ok(_mapper.Map<ICollection<TimestampGeneralDto>>(timestamps));
        }

        [HttpGet("workhistory/{username}")]
        public async Task<IActionResult> GetUserWorkHistory(string username,
            [FromQuery] WorkHistoryParameters workHistoryParameters)
        {
            try
            {
                var user = await _userRepository.GetUser(username);

                //if user not found
                if (user == null)
                    return NotFound($"Username {username} not found.");

                //max 30 days
                var timestamps = await _timestampRepository.GetTimestampsForUserByWorkDate(user, workHistoryParameters);
                //form custom DTO based on timestamps
                var history = TimestampActions.GetUserWorkHistory(timestamps);

                var dto = new UserWorkHistoryWithTotalDto
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    workHistory = history
                };

                return Ok(dto);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve user data");
            }            
        }
        
        [HttpGet("workhistory")]
        public async Task<IActionResult> GetWorkHistory(
            [FromQuery] WorkHistoryParameters workHistoryParameters)
        {
            //max 30 days
            var timestamps = await _timestampRepository.GetTimestamps(workHistoryParameters);
            //form custom DTO based on timestamps
            var history = TimestampActions.GetWorkHistory(timestamps);

            return Ok(history);
        }

        [HttpGet("jobsitesVisited")]
        public async Task<IActionResult> GetJobsitesVisited(
            [FromQuery] TimestampParameters timestampParameters)
        {
            var timestamps = await _timestampRepository.GetTimestampsUnpaged(timestampParameters);

            //get Jobsites visited
            var jobsitesVisited = TimestampActions.GetJobsitesFromTimestamps(timestamps);

            //page the results
            var pagedJobsitesVisited = PagedList<JobsiteBasicDto>.ToPagedListFromList(
                jobsitesVisited, 
                timestampParameters.PageNumber, 
                timestampParameters.PageSize);

            var metadata = new
            {
                pagedJobsitesVisited.TotalCount,
                pagedJobsitesVisited.PageSize,
                pagedJobsitesVisited.CurrentPage,
                pagedJobsitesVisited.HasNext,
                pagedJobsitesVisited.HasPrevious
            };

            //Add page info to header
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

            return Ok(pagedJobsitesVisited);
        }

        [HttpGet("clockedin")]
        public async Task<ActionResult<object>> CurrentlyClockedIn()
        {
            var timestamps = await _timestampRepository.TimestampsCurrentlyClockedIn();
            //get list of strings of employee names 
            var clockedInEmployees = TimestampActions.ClockedInEmployees(timestamps);

            var dto = new
            {
                currentlyClockedIn = clockedInEmployees,
                timestamps = _mapper.Map<ICollection<TimestampClockedInDto>>(timestamps)
            };
            return Ok(dto);
        }
    }
}
