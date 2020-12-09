using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.ActionHelpers;
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
        private readonly IMapper _imapper;
        private readonly ITimestampRepository _timestampRepository;

        //constructor
        public TimestampsController(IMapper imapper, ITimestampRepository timestampRepository)
        {
            _imapper = imapper;
            _timestampRepository = timestampRepository;
        }

        [HttpGet]
        public async Task<ActionResult<object>> TimestampHome()
        {
            var timestamps = await _timestampRepository.GetAllTimestamps();
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

        [HttpGet("clockedin")]
        public async Task<ActionResult<object>> CurrentlyClockedIn()
        {
            var timestamps = await _timestampRepository.TimestampsCurrentlyClockedIn();
            var clockedInEmployees = TimestampActions.ClockedInEmployees(timestamps);

            var dto = new
            {
                currentlyClockedIn = clockedInEmployees,
                timestamps = _imapper.Map<ICollection<TimestampClockedInDto>>(timestamps)
            };

            return Ok(dto);
        }
    }
}
