using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class TimestampsController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;
        private readonly IMapper _mapper;

        public TimestampsController(
            IUserRepository userRepository,
            IUserAccessor userAccessor,
            ITimestampRepository timestampRepository,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _userAccessor = userAccessor;
            _timestampRepository = timestampRepository;
            _mapper = mapper;
        }

        [HttpGet("{username}")] 
        public async Task<IActionResult> GetAllTimeStamps(string username, string fromDate, string toDate)
        {
            try
            {
                var user = await _userRepository.GetUser(username, true);

                //NotFound() if user not found
                if (user == null)
                    return NotFound($"Username {username} not found.");
                
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
    }
}
