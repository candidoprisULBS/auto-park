using CarServiceAPI.Models;
using CarServiceAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.ConstrainedExecution;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        /// <summary>
        /// Create a new car
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCar([FromBody] CreateCarRequest request)
        {
            try
            {
                var car = new Car
                {
                    Id = request.Id,
                    MakeId = request.MakeId,
                    Model = request.Model,
                    Year = request.Year,
                    Type = request.Type,
                    Engine = request.Engine,
                    LicencePlate = request.LicencePlate,
                    FirstRegistration = request.FirstRegistration
                };

                var result = await _carService.CreateCarAsync(car);
                return Ok(new { message = "Car created successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all cars
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllCars()
        {
            try
            {
                var cars = await _carService.GetAllCarsAsync();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get car by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(Guid id)
        {
            try
            {
                var car = await _carService.GetCarByIdAsync(id);
                if (car == null)
                    return NotFound(new { message = "Car not found" });

                return Ok(car);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update car
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(Guid id, [FromBody] UpdateCarRequest request)
        {
            try
            {
                var car = new Car
                {
                    Id = id,
                    MakeId = request.MakeId,
                    Model = request.Model,
                    Year = request.Year ?? 0,
                    Type = request.Type,
                    Engine = request.Engine,
                    LicencePlate = request.LicencePlate,
                    FirstRegistration = request.FirstRegistration ?? 0
                };

                var result = await _carService.UpdateCarAsync(id, car);
                return Ok(new { message = "Car updated successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete car
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(Guid id)
        {
            try
            {
                var result = await _carService.DeleteCarAsync(id);
                return Ok(new { message = "Car deleted successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Search cars by licence plate
        /// </summary>
        [HttpGet("search/licence-plate")]
        public async Task<IActionResult> SearchByLicencePlate([FromQuery] string licencePlate)
        {
            try
            {
                var cars = await _carService.SearchCarByLicencePlateAsync(licencePlate);
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateCarRequest
    {
        public Guid Id { get; set; }
        public Guid? MakeId { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public string Engine { get; set; }
        public string LicencePlate { get; set; }
        public int FirstRegistration { get; set; }
    }

    public class UpdateCarRequest
    {
        public Guid? MakeId { get; set; }
        public string Model { get; set; }
        public int? Year { get; set; }
        public string Type { get; set; }
        public string Engine { get; set; }
        public string LicencePlate { get; set; }
        public int? FirstRegistration { get; set; }
    }
}