using AutoMapper;
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

        //constructor
        public TimestampsController(IMapper imapper, ITimestampRepository timestampRepository)
        {
            _mapper = imapper;
            _timestampRepository = timestampRepository;
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

        [HttpGet("info/workhistory")]
        public async Task<IActionResult> GetEmployeeWorkHistory(
            [FromQuery] WorkHistoryParameters workHistoryParameters)
        {
            //max 30 days
            var timestamps = await _timestampRepository.GetTimestamps(workHistoryParameters);
            //form custom DTO based on timestamps
            var history = TimestampActions.GetUserWorkHistory(timestamps);

            return Ok(history);
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
