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

        //constructor
        public JobsitesController(IPayrollRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
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

    }
}
