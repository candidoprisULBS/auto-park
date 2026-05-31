using CarServiceAPI.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CarServiceAPI.Services
{
    public interface IDriverService
    {
        Task<IEnumerable<Driver>> GetAllDriversAsync();
        Task<Driver> GetDriverByIdAsync(Guid id);
        Task<IEnumerable<Driver>> SearchDriverAsync(string firstName, string lastName, string emailAddress, string phoneNo);
        Task<int> CreateDriverAsync(Driver driver);
        Task<int> UpdateDriverAsync(Guid id, Driver driver);
        Task<int> DeleteDriverAsync(Guid id);
    }

    public class DriverService : IDriverService
    {
        private readonly IConfiguration _configuration;

        public DriverService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Get all drivers from the database using sp_GetDriver stored procedure
        /// </summary>
        public async Task<IEnumerable<Driver>> GetAllDriversAsync()
        {
            var drivers = new List<Driver>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            drivers.Add(new Driver
                            {
                                Id = (Guid)reader["ID"],
                                FirstName = reader["firstName"].ToString(),
                                LastName = reader["lastName"].ToString(),
                                LicenceExpiration = (DateTime)reader["licenceExpiration"],
                                EmailAddress = reader["emailAddress"].ToString(),
                                PhoneNo = reader["phoneNo"].ToString(),
                                Address = reader["address"].ToString(),
                                City = reader["city"].ToString(),
                                ZipCode = reader["zipCode"].ToString()
                            });
                        }
                    }
                }
            }

            return drivers;
        }

        /// <summary>
        /// Get a specific driver by ID using sp_GetDriver stored procedure
        /// </summary>
        public async Task<Driver> GetDriverByIdAsync(Guid id)
        {
            Driver driver = null;

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            driver = new Driver
                            {
                                Id = (Guid)reader["ID"],
                                FirstName = reader["firstName"].ToString(),
                                LastName = reader["lastName"].ToString(),
                                LicenceExpiration = (DateTime)reader["licenceExpiration"],
                                EmailAddress = reader["emailAddress"].ToString(),
                                PhoneNo = reader["phoneNo"].ToString(),
                                Address = reader["address"].ToString(),
                                City = reader["city"].ToString(),
                                ZipCode = reader["zipCode"].ToString()
                            };
                        }
                    }
                }
            }

            return driver;
        }

        /// <summary>
        /// Create a new driver using sp_InsertDriver stored procedure
        /// </summary>
        public async Task<int> CreateDriverAsync(Driver driver)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_InsertDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", driver.Id);
                    command.Parameters.AddWithValue("@firstName", driver.FirstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@lastName", driver.LastName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@licenceExpiration", driver.LicenceExpiration);
                    command.Parameters.AddWithValue("@emailAddress", driver.EmailAddress ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@phoneNo", driver.PhoneNo ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@address", driver.Address ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@city", driver.City ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@zipCode", driver.ZipCode ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Update an existing driver using sp_UpdateDriver stored procedure
        /// </summary>
        public async Task<int> UpdateDriverAsync(Guid id, Driver driver)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_UpdateDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@firstName", driver.FirstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@lastName", driver.LastName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@licenceExpiration", driver.LicenceExpiration);
                    command.Parameters.AddWithValue("@emailAddress", driver.EmailAddress ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@phoneNo", driver.PhoneNo ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@address", driver.Address ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@city", driver.City ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@zipCode", driver.ZipCode ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Delete a driver using sp_DeleteDriver stored procedure
        /// </summary>
        public async Task<int> DeleteDriverAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_DeleteDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Search for drivers by firstName, lastName, emailAddress, or phoneNo using sp_SearchDriver stored procedure
        /// </summary>
        public async Task<IEnumerable<Driver>> SearchDriverAsync(string firstName, string lastName, string emailAddress, string phoneNo)
        {
            var drivers = new List<Driver>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_SearchDriver", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@firstName", firstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@lastName", lastName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@emailAddress", emailAddress ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@phoneNo", phoneNo ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            drivers.Add(new Driver
                            {
                                Id = (Guid)reader["ID"],
                                FirstName = reader["firstName"].ToString(),
                                LastName = reader["lastName"].ToString(),
                                LicenceExpiration = (DateTime)reader["licenceExpiration"],
                                EmailAddress = reader["emailAddress"].ToString(),
                                PhoneNo = reader["phoneNo"].ToString(),
                                Address = reader["address"].ToString(),
                                City = reader["city"].ToString(),
                                ZipCode = reader["zipCode"].ToString()
                            });
                        }
                    }
                }
            }

            return drivers;
        }
    }
}
