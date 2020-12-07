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
    [Route("api/{username}/[Controller]")]
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

        [HttpGet]
        public async Task<IActionResult> GetAllTimeStamps(string username)
        {
            try
            {
                var user = await _userRepository.GetUser(username, true);

                if (user == null)
                    return NotFound($"Username {username} not found.");

                var userWithTimestamps = _mapper.Map<UserInfoWithTimestampsDto>(user);
                return Ok(userWithTimestamps);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Server Error: Failed to retrieve user data");
            }
        }
    }
}
