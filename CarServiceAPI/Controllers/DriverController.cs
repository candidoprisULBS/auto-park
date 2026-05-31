using CarServiceAPI.Models;
using CarServiceAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        /// <summary>
        /// Create a new driver
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateDriver([FromBody] CreateDriverRequest request)
        {
            try
            {
                var driver = new Driver
                {
                    Id = request.Id,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    LicenceExpiration = request.LicenceExpiration,
                    EmailAddress = request.EmailAddress,
                    PhoneNo = request.PhoneNo,
                    Address = request.Address,
                    City = request.City,
                    ZipCode = request.ZipCode
                };

                var result = await _driverService.CreateDriverAsync(driver);
                return Ok(new { message = "Driver created successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all drivers
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllDrivers()
        {
            try
            {
                var drivers = await _driverService.GetAllDriversAsync();
                return Ok(drivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get driver by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriverById(Guid id)
        {
            try
            {
                var driver = await _driverService.GetDriverByIdAsync(id);
                if (driver == null)
                    return NotFound(new { message = "Driver not found" });

                return Ok(driver);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update driver
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(Guid id, [FromBody] UpdateDriverRequest request)
        {
            try
            {
                var driver = new Driver
                {
                    Id = id,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    LicenceExpiration = request.LicenceExpiration ?? DateTime.MinValue,
                    EmailAddress = request.EmailAddress,
                    PhoneNo = request.PhoneNo,
                    Address = request.Address,
                    City = request.City,
                    ZipCode = request.ZipCode
                };

                var result = await _driverService.UpdateDriverAsync(id, driver);
                return Ok(new { message = "Driver updated successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete driver
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(Guid id)
        {
            try
            {
                var result = await _driverService.DeleteDriverAsync(id);
                return Ok(new { message = "Driver deleted successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Search drivers by firstName, lastName, emailAddress, or phoneNo
        /// </summary>
        [HttpGet("search")]
        public async Task<IActionResult> SearchDriver([FromQuery] string firstName, [FromQuery] string lastName, [FromQuery] string emailAddress, [FromQuery] string phoneNo)
        {
            try
            {
                var drivers = await _driverService.SearchDriverAsync(firstName, lastName, emailAddress, phoneNo);
                return Ok(drivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateDriverRequest
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime LicenceExpiration { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
    }

    public class UpdateDriverRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? LicenceExpiration { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
    }
}