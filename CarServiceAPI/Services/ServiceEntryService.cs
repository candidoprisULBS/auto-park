using CarServiceAPI.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CarServiceAPI.Services
{
    public interface IServiceEntryService
    {
        Task<IEnumerable<ServiceEntry>> GetAllEntriesAsync();
        Task<ServiceEntry> GetEntryByIdAsync(Guid id);
        Task<int> CreateEntryAsync(ServiceEntry entry);
        Task<int> UpdateEntryAsync(Guid id, ServiceEntry entry);
        Task<int> DeleteEntryAsync(Guid id);
    }

    public class ServiceEntryService : IServiceEntryService
    {
        private readonly IConfiguration _configuration;

        public ServiceEntryService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Get all service entries from the database using sp_GetServiceEntry stored procedure
        /// </summary>
        public async Task<IEnumerable<ServiceEntry>> GetAllEntriesAsync()
        {
            var entries = new List<ServiceEntry>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetServiceEntry", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            entries.Add(new ServiceEntry
                            {
                                Id = (Guid)reader["ID"],
                                CarId = (Guid)reader["carID"],
                                DriverId = (Guid)reader["driverID"],
                                Mileage = (int)reader["mileage"],
                                Accident = reader["accident"].ToString()
                            });
                        }
                    }
                }
            }

            return entries;
        }

        /// <summary>
        /// Get a specific service entry by ID using sp_GetServiceEntry stored procedure
        /// </summary>
        public async Task<ServiceEntry> GetEntryByIdAsync(Guid id)
        {
            ServiceEntry entry = null;

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetServiceEntry", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            entry = new ServiceEntry
                            {
                                Id = (Guid)reader["ID"],
                                CarId = (Guid)reader["carID"],
                                DriverId = (Guid)reader["driverID"],
                                Mileage = (int)reader["mileage"],
                                Accident = reader["accident"].ToString()
                            };
                        }
                    }
                }
            }

            return entry;
        }

        /// <summary>
        /// Create a new service entry using sp_InsertServiceEntry stored procedure
        /// </summary>
        public async Task<int> CreateEntryAsync(ServiceEntry entry)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_InsertServiceEntry", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", entry.Id);
                    command.Parameters.AddWithValue("@carID", entry.CarId);
                    command.Parameters.AddWithValue("@driverID", entry.DriverId);
                    command.Parameters.AddWithValue("@mileage", entry.Mileage);
                    command.Parameters.AddWithValue("@accident", entry.Accident ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Update an existing service entry using sp_UpdateServiceEntry stored procedure
        /// </summary>
        public async Task<int> UpdateEntryAsync(Guid id, ServiceEntry entry)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_UpdateServiceEntry", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@carID", entry.CarId);
                    command.Parameters.AddWithValue("@driverID", entry.DriverId);
                    command.Parameters.AddWithValue("@mileage", entry.Mileage);
                    command.Parameters.AddWithValue("@accident", entry.Accident ?? (object)DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Delete a service entry using sp_DeleteServiceEntry stored procedure
        /// </summary>
        public async Task<int> DeleteEntryAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_DeleteServiceEntry", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
