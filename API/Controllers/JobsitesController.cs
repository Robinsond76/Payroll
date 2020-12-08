using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.Profiles;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Payroll.Data.Services;
using Payroll.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsitesController : ControllerBase
    {
        private readonly IPayrollRepository _repository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;


        //constructor
        public JobsitesController(
            IPayrollRepository repository, 
            IMapper mapper,
            IUserRepository userRepository,
            IUserAccessor userAccessor,
            ITimestampRepository timestampRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _userRepository = userRepository;
            _userAccessor = userAccessor;
            _timestampRepository = timestampRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<JobsiteDto>>> GetAllJobsites()
        {
            try
            {
                var results = await _repository.GetAllJobsitesAsync();
                return _mapper.Map<List<JobsiteDto>>(results);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve all jobsites.");
            }
        }

        [HttpGet("{moniker}", Name = "GetJobsiteAsync")]
        public async Task<ActionResult<JobsiteDto>> GetJobsite(string moniker)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);

                if (jobsite == null)
                    return NotFound($"Could not find jobsite with moniker of {moniker}");

                return Ok(_mapper.Map<JobsiteDto>(jobsite));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve jobsite.");
            }
        }

        [HttpGet("{moniker}/timestamps")]
        public async Task<ActionResult<JobsiteDto>> GetJobsiteWithTimestamps(string moniker, string fromDate, string toDate)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);

                if (jobsite == null)
                    return NotFound($"Could not find jobsite with moniker of {moniker}");

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

                    var filteredTimestamps = jobsite.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime && t.ClockedIn == false).ToList();

                    jobsite.Timestamps = filteredTimestamps;

                    var userWithFilteredTimestamps = _mapper.Map<JobsiteWithTimestampsDto>(jobsite);
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

                    var filteredTimestamps = jobsite.Timestamps.Where(t =>
                        t.ClockedInStamp >= fromDateTime &&
                        t.ClockedInStamp <= toDateTime &&
                        t.ClockedIn == false).ToList();

                    jobsite.Timestamps = filteredTimestamps;

                    var userWithFilteredTimestamps = _mapper.Map<JobsiteWithTimestampsDto>(jobsite);
                    return Ok(userWithFilteredTimestamps);
                }


                //else return all timestamps
                return Ok(_mapper.Map<JobsiteWithTimestampsDto>(jobsite));

            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve jobsite.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<JobsiteDto>> AddJobsite(JobsiteDto model)
        {
            try
            {
                //var exists = await _repository.GetJobsiteAsync(model.Moniker);
                //if (exists != null) return BadRequest("Job moniker already exists.");

                var exists = await _repository.JobsiteExistsAsync(model.Moniker);
                if (exists) return BadRequest("Job moniker already exists.");

                var jobsite = _mapper.Map<Jobsite>(model);
                _repository.Add(jobsite);
                if (await _repository.SaveChangesAsync())
                    return CreatedAtRoute("GetJobsiteAsync", new { moniker = model.Moniker }, _mapper.Map<JobsiteDto>(jobsite));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to add Jobsite.");
            }
            return BadRequest();
        }

        [HttpPut("{moniker}")]
        public async Task<ActionResult<JobsiteDto>> UpdateJobsite(string moniker, JobsiteDto model)
        {
            try
            {
                var oldJobsite = await _repository.GetJobsiteAsync(moniker);
                if (oldJobsite == null) return NotFound($"Could not find jobsite with moniker of {moniker}");

                _mapper.Map(model, oldJobsite);

                if (await _repository.SaveChangesAsync())
                    return _mapper.Map<JobsiteDto>(oldJobsite);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Update failed.");
            }
            return BadRequest();
        }

        [HttpDelete("{moniker}")]
        public async Task<IActionResult> DeleteJobsite(string moniker)
        {
            try
            {
                var oldJobsite = await _repository.GetJobsiteAsync(moniker);
                if (oldJobsite == null) return NotFound($"Could not find jobsite with moniker of {moniker}");

                _repository.Delete(oldJobsite);

                if (await _repository.SaveChangesAsync())
                    return Ok("Jobsite deleted.");
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to delete jobsite.");
            }
            return BadRequest();
        }

        [HttpPost("{moniker}/clockin")]
        public async Task<IActionResult> ClockIn(string moniker)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);
                if (jobsite == null)
                    return NotFound();

                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());

                //if already clocked in, bad request
                var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
                if (currentlyClockedin != null)
                    return BadRequest($"Already clocked in at {currentlyClockedin.Jobsite.Moniker}");

                //clock in
                if (await _timestampRepository.ClockIn(jobsite, user))
                    return Ok("Clocked in Successfully.");
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to clock in");
            }
            return BadRequest();
        }

        [HttpPost("{moniker}/clockinlunch")]
        public async Task<IActionResult> ClockInLunch(string moniker)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);
                if (jobsite == null)
                    return NotFound();

                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());

                //If not already clocked in, bad request
                var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
                if (currentlyClockedin == null)
                    return BadRequest($"You must first be clocked in to {jobsite.Moniker} to clock in for lunch. ");

                //if clocked in to another job, bad request
                if (currentlyClockedin.JobsiteId != jobsite.JobsiteId)
                    return BadRequest($"You're currently clocked in to another job: {currentlyClockedin.Jobsite.Moniker}");

                //if already clocked in for lunch, bad request
                if (currentlyClockedin.LunchStamp != System.DateTime.MinValue)
                    return BadRequest($"You've already clocked in for lunch.");

                //if clockedin to the correct jobsite, clockinLunch
                var success = await _timestampRepository.ClockInLunch(user);
                if (success)
                    return Ok("Successfully clocked in for lunch");
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to clock in for lunch");
            }
            return BadRequest();

        }

        [HttpPost("{moniker}/clockout")]
        public async Task<IActionResult> ClockOut(string moniker)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);
                if (jobsite == null)
                    return NotFound();

                var user = await _userRepository.GetUser(_userAccessor.GetCurrentUsername());

                //If not already clocked in, bad request
                var currentlyClockedin = await _timestampRepository.GetClockedInTimestamp(user);
                if (currentlyClockedin == null)
                    return BadRequest($"You must first be clocked in to {jobsite.Moniker} to clock out. ");

                //if clocked in to another job, bad request
                if (currentlyClockedin.JobsiteId != jobsite.JobsiteId)
                    return BadRequest($"You're currently clocked in to another job: {currentlyClockedin.Jobsite.Moniker}");

                //if clockedin to the correct jobsite, clock out
                var success = await _timestampRepository.ClockOut(user);
                if (success)
                    return Ok($"Successfully clocked out of {moniker}.");
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to clock out.");
            }
            return BadRequest();
        }
    }
}
