using CarServiceAPI.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CarServiceAPI.Services
{
    public interface IDriverAlertService
    {
        Task<IEnumerable<DriverAlert>> GetAllAlertsAsync();
        Task<DriverAlert> GetAlertByIdAsync(Guid id);
        Task<int> CreateAlertAsync(DriverAlert alert);
        Task<int> UpdateAlertAsync(Guid id, DriverAlert alert);
        Task<int> DeleteAlertAsync(Guid id);
    }

    public class DriverAlertService : IDriverAlertService
    {
        private readonly IConfiguration _configuration;

        public DriverAlertService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Get all alerts from the database using sp_GetDriverAlerts stored procedure
        /// </summary>
        public async Task<IEnumerable<DriverAlert>> GetAllAlertsAsync()
        {
            var alerts = new List<DriverAlert>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetDriverAlerts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            alerts.Add(new DriverAlert
                            {
                                Id = (Guid)reader["ID"],
                                DriverId = (Guid)reader["driverID"],
                                TypeId = (Guid)reader["typeID"],
                                Expiration = (DateTime)reader["expiration"]
                            });
                        }
                    }
                }
            }

            return alerts;
        }

        /// <summary>
        /// Get a specific alert by ID using sp_GetDriverAlerts stored procedure
        /// </summary>
        public async Task<DriverAlert> GetAlertByIdAsync(Guid id)
        {
            DriverAlert alert = null;

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetDriverAlerts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            alert = new DriverAlert
                            {
                                Id = (Guid)reader["ID"],
                                DriverId = (Guid)reader["driverID"],
                                TypeId = (Guid)reader["typeID"],
                                Expiration = (DateTime)reader["expiration"]
                            };
                        }
                    }
                }
            }

            return alert;
        }

        /// <summary>
        /// Create a new alert using sp_InsertDriverAlerts stored procedure
        /// </summary>
        public async Task<int> CreateAlertAsync(DriverAlert alert)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_InsertDriverAlerts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", alert.Id);
                    command.Parameters.AddWithValue("@driverID", alert.DriverId);
                    command.Parameters.AddWithValue("@typeID", alert.TypeId);
                    command.Parameters.AddWithValue("@expiration", alert.Expiration);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Update an existing alert using sp_UpdateDriverAlerts stored procedure
        /// </summary>
        public async Task<int> UpdateAlertAsync(Guid id, DriverAlert alert)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_UpdateDriverAlerts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@driverID", alert.DriverId);
                    command.Parameters.AddWithValue("@typeID", alert.TypeId);
                    command.Parameters.AddWithValue("@expiration", alert.Expiration);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Delete an alert using sp_DeleteDriverAlerts stored procedure
        /// </summary>
        public async Task<int> DeleteAlertAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_DeleteDriverAlerts", connection))
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
