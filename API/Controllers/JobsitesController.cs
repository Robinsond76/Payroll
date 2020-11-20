using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        [Route("{moniker}")]
        public async Task<ActionResult<JobsiteDto>> GetJobsiteAsync(string moniker)
        {
            var jobsite = await _repository.GetJobsiteAsync(moniker);
            return Ok(_mapper.Map<JobsiteDto>(jobsite));
        }

    }
}
