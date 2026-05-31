using CarServiceAPI.Models;
using CarServiceAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriverAlertsController : ControllerBase
    {
        private readonly IDriverAlertService _alertService;

        public DriverAlertsController(IDriverAlertService alertService)
        {
            _alertService = alertService;
        }

        /// <summary>
        /// Create a new alert
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateAlert([FromBody] CreateDriverAlertRequest request)
        {
            try
            {
                var alert = new DriverAlert
                {
                    Id = request.Id,
                    DriverId = request.DriverId,
                    TypeId = request.TypeId,
                    Expiration = request.Expiration
                };

                var result = await _alertService.CreateAlertAsync(alert);
                return Ok(new { message = "Alert created successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all alerts
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllAlerts()
        {
            try
            {
                var alerts = await _alertService.GetAllAlertsAsync();
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get alert by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlertById(Guid id)
        {
            try
            {
                var alert = await _alertService.GetAlertByIdAsync(id);
                if (alert == null)
                    return NotFound(new { message = "Alert not found" });

                return Ok(alert);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update alert
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAlert(Guid id, [FromBody] UpdateDriverAlertRequest request)
        {
            try
            {
                var alert = new DriverAlert
                {
                    Id = id,
                    DriverId = request.DriverId ?? Guid.Empty,
                    TypeId = request.TypeId ?? Guid.Empty,
                    Expiration = request.Expiration ?? DateTime.MinValue
                };

                var result = await _alertService.UpdateAlertAsync(id, alert);
                return Ok(new { message = "Alert updated successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete alert
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlert(Guid id)
        {
            try
            {
                var result = await _alertService.DeleteAlertAsync(id);
                return Ok(new { message = "Alert deleted successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateDriverAlertRequest
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Guid TypeId { get; set; }
        public DateTime Expiration { get; set; }
    }

    public class UpdateDriverAlertRequest
    {
        public Guid? DriverId { get; set; }
        public Guid? TypeId { get; set; }
        public DateTime? Expiration { get; set; }
    }
}