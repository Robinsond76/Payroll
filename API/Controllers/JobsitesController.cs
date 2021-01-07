﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.Profiles;
using Payroll.Data.Helpers;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Payroll.Data.Services;
using Payroll.Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsitesController : ControllerBase
    {
        private readonly IJobsiteRepository _repository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IUserAccessor _userAccessor;
        private readonly ITimestampRepository _timestampRepository;


        //constructor
        public JobsitesController(
            IJobsiteRepository repository,
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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<JobsiteDto>>> GetAllJobsites([FromQuery] PageParameters pageParameters)
        {
            try
            {
                var results = await _repository.GetAllJobsitesAsync(pageParameters);

                var metadata = new
                {
                    results.TotalCount,
                    results.PageSize,
                    results.CurrentPage,
                    results.HasNext,
                    results.HasPrevious
                };

                //Add page info to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));


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

        //Get all timestamps for a particular jobsite - can sort by date
        [HttpGet("{moniker}/timestamps")]
        public async Task<ActionResult<JobsiteDto>> GetJobsiteWithTimestamps(string moniker, [FromQuery] TimestampParameters timestampParameters)
        {
            try
            {
                var jobsite = await _repository.GetJobsiteAsync(moniker);

                if (jobsite == null)
                    return NotFound($"Could not find jobsite with moniker of {moniker}");

                var pagedTimestamps = await _timestampRepository.GetTimestampsForJobByDate(jobsite, timestampParameters);
                jobsite.Timestamps = pagedTimestamps;

                //Create MetaData
                var metadata = new
                {
                    pagedTimestamps.TotalCount,
                    pagedTimestamps.PageSize,
                    pagedTimestamps.CurrentPage,
                    pagedTimestamps.HasNext,
                    pagedTimestamps.HasPrevious
                };

                //Add metadata to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                var jobsiteDto = _mapper.Map<JobsiteWithTimestampsDto>(jobsite);

                //get all employees who visited this jobsite
                var jobsiteTimestamps = await _timestampRepository.GetTimestampsForJob(jobsite);
                var employees = TimestampActions.GetEmployeesFromJobsite(jobsiteTimestamps);
                jobsiteDto.EmployeesThatClocked = employees;

                return Ok(jobsiteDto);

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

        [HttpGet("search")]
        public async Task<IActionResult> SearchJobsites([FromQuery] string q, 
            [FromQuery] PageParameters pageParameters)
        {
            try
            {
                var searchResults = await _repository.SearchJobsites(q, pageParameters);

                var metadata = new
                {
                    searchResults.TotalCount,
                    searchResults.PageSize,
                    searchResults.CurrentPage,
                    searchResults.HasNext,
                    searchResults.HasPrevious
                };

                //Add page info to header
                Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

                return Ok(_mapper.Map<List<JobsiteDto>>(searchResults));
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to find jobsite.");
            }
        }
    }
}
