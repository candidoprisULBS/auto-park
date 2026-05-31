using CarServiceAPI.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CarServiceAPI.Services
{
    public interface ICarService
    {
        Task<IEnumerable<Car>> GetAllCarsAsync();
        Task<Car> GetCarByIdAsync(Guid id);
        Task<IEnumerable<Car>> SearchCarByLicencePlateAsync(string licencePlate);
        Task<int> CreateCarAsync(Car car);
        Task<int> UpdateCarAsync(Guid id, Car car);
        Task<int> DeleteCarAsync(Guid id);
    }

    public class CarService : ICarService
    {
        private readonly IConfiguration _configuration;

        public CarService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection") 
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Get all cars from the database using sp_GetCar stored procedure
        /// </summary>
        public async Task<IEnumerable<Car>> GetAllCarsAsync()
        {
            var cars = new List<Car>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetCar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    // No ID parameter means get all cars
                    
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cars.Add(new Car
                            {
                                Id = (Guid)reader["ID"],
                                MakeId = reader["makeID"] != DBNull.Value ? (Guid?)reader["makeID"] : null,
                                Model = reader["model"].ToString(),
                                Year = (int)reader["year"],
                                Type = reader["type"].ToString(),
                                Engine = reader["engine"].ToString(),
                                LicencePlate = reader["licencePlate"].ToString(),
                                FirstRegistration = (int)reader["firstRegistration"]
                            });
                        }
                    }
                }
            }

            return cars;
        }

        /// <summary>
        /// Get a specific car by ID using sp_GetCar stored procedure
        /// </summary>
        public async Task<Car> GetCarByIdAsync(Guid id)
        {
            Car car = null;

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetCar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            car = new Car
                            {
                                Id = (Guid)reader["ID"],
                                MakeId = reader["makeID"] != DBNull.Value ? (Guid?)reader["makeID"] : null,
                                Model = reader["model"].ToString(),
                                Year = (int)reader["year"],
                                Type = reader["type"].ToString(),
                                Engine = reader["engine"].ToString(),
                                LicencePlate = reader["licencePlate"].ToString(),
                                FirstRegistration = (int)reader["firstRegistration"]
                            };
                        }
                    }
                }
            }

            return car;
        }

        /// <summary>
        /// Create a new car using sp_InsertCar stored procedure
        /// </summary>
        public async Task<int> CreateCarAsync(Car car)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_InsertCar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", car.Id);
                    command.Parameters.AddWithValue("@make", car.MakeId.HasValue ? (object)car.MakeId : DBNull.Value);
                    command.Parameters.AddWithValue("@model", car.Model ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@year", car.Year == 0 ? (object)DBNull.Value : car.Year);
                    command.Parameters.AddWithValue("@type", car.Type ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@engine", car.Engine ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@licencePlate", car.LicencePlate ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@firstRegistration", car.FirstRegistration == 0 ? (object)DBNull.Value : car.FirstRegistration);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Update an existing car using sp_UpdateCar stored procedure
        /// </summary>
        public async Task<int> UpdateCarAsync(Guid id, Car car)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_UpdateCar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@make", car.MakeId.HasValue ? (object)car.MakeId : DBNull.Value);
                    command.Parameters.AddWithValue("@model", car.Model ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@year", car.Year == 0 ? (object)DBNull.Value : car.Year);
                    command.Parameters.AddWithValue("@type", car.Type ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@engine", car.Engine ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@licencePlate", car.LicencePlate ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@firstRegistration", car.FirstRegistration == 0 ? (object)DBNull.Value : car.FirstRegistration);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Delete a car using sp_DeleteCar stored procedure
        /// </summary>
        public async Task<int> DeleteCarAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_DeleteCar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Search for cars by licence plate using sp_SearchCarByLicencePlate stored procedure
        /// </summary>
        public async Task<IEnumerable<Car>> SearchCarByLicencePlateAsync(string licencePlate)
        {
            var cars = new List<Car>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_SearchCarByLicencePlate", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@licencePlate", licencePlate ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cars.Add(new Car
                            {
                                Id = (Guid)reader["ID"],
                                MakeId = reader["makeID"] != DBNull.Value ? (Guid?)reader["makeID"] : null,
                                Model = reader["model"].ToString(),
                                Year = (int)reader["year"],
                                Type = reader["type"].ToString(),
                                Engine = reader["engine"].ToString(),
                                LicencePlate = reader["licencePlate"].ToString(),
                                FirstRegistration = (int)reader["firstRegistration"]
                            });
                        }
                    }
                }
            }

            return cars;
        }
    }
}
