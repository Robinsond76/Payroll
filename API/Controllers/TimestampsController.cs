using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Payroll.Data.ActionHelpers;
using Payroll.Data.Interfaces;
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

        public TimestampsController(IMapper imapper, ITimestampRepository timestampRepository)
        {
            _imapper = imapper;
            _timestampRepository = timestampRepository;
        }

        [HttpGet]
        public async Task<IActionResult> TimestampHome()
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
    }
}
