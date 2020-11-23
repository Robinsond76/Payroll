using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payroll.Core;
using Payroll.Data.Business;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<ActionResult<List<JobsiteDto>>> GetAllJobsitesAsync()
        {
            var results = await _repository.GetAllJobsitesAsync();
            return _mapper.Map<List<JobsiteDto>>(results);
        }

        [HttpGet("{moniker}", Name = "GetJobsiteAsync")]
        public async Task<ActionResult<JobsiteDto>> GetJobsiteAsync(string moniker)
        {
            var jobsite = await _repository.GetJobsiteAsync(moniker);
            return Ok(_mapper.Map<JobsiteDto>(jobsite));
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
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database failed to save.");
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
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database failed to save.");
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
                    return Ok();
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Database failed to save.");
            }
            return BadRequest("Failed to delete camp");
        }

    }
}
