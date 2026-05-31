using CarServiceAPI.Models;
using CarServiceAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceEntryController : ControllerBase
    {
        private readonly IServiceEntryService _entryService;

        public ServiceEntryController(IServiceEntryService entryService)
        {
            _entryService = entryService;
        }

        /// <summary>
        /// Create a new entry
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateEntry([FromBody] CreateServiceEntryRequest request)
        {
            try
            {
                var entry = new ServiceEntry
                {
                    Id = request.Id,
                    CarId = request.CarId,
                    DriverId = request.DriverId,
                    Mileage = request.Mileage,
                    Accident = request.Accident
                };

                var result = await _entryService.CreateEntryAsync(entry);
                return Ok(new { message = "Service entry created successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all entries
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllEntries()
        {
            try
            {
                var entries = await _entryService.GetAllEntriesAsync();
                return Ok(entries);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get entry by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEntryById(Guid id)
        {
            try
            {
                var entry = await _entryService.GetEntryByIdAsync(id);
                if (entry == null)
                    return NotFound(new { message = "Service entry not found" });

                return Ok(entry);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update entry
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntry(Guid id, [FromBody] UpdateServiceEntryRequest request)
        {
            try
            {
                var entry = new ServiceEntry
                {
                    Id = id,
                    CarId = request.CarId ?? Guid.Empty,
                    DriverId = request.DriverId ?? Guid.Empty,
                    Mileage = request.Mileage ?? 0,
                    Accident = request.Accident
                };

                var result = await _entryService.UpdateEntryAsync(id, entry);
                return Ok(new { message = "Service entry updated successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete entry
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(Guid id)
        {
            try
            {
                var result = await _entryService.DeleteEntryAsync(id);
                return Ok(new { message = "Service entry deleted successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateServiceEntryRequest
    {
        public Guid Id { get; set; }
        public Guid CarId { get; set; }
        public Guid DriverId { get; set; }
        public int Mileage { get; set; }
        public string Accident { get; set; }
    }

    public class UpdateServiceEntryRequest
    {
        public Guid? CarId { get; set; }
        public Guid? DriverId { get; set; }
        public int? Mileage { get; set; }
        public string Accident { get; set; }
    }
}