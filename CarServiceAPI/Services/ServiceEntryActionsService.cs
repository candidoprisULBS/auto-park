using CarServiceAPI.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace CarServiceAPI.Services
{
    public interface IServiceEntryActionsService
    {
        Task<IEnumerable<ServiceEntryAction>> GetAllActionsAsync();
        Task<ServiceEntryAction> GetActionByIdAsync(Guid id);
        Task<int> CreateActionAsync(ServiceEntryAction action);
        Task<int> UpdateActionAsync(Guid id, ServiceEntryAction action);
        Task<int> DeleteActionAsync(Guid id);
    }

    public class ServiceEntryActionsService : IServiceEntryActionsService
    {
        private readonly IConfiguration _configuration;

        public ServiceEntryActionsService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private string GetConnectionString()
        {
            return _configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Get all service entry actions from the database using sp_GetServiceEntryActions stored procedure
        /// </summary>
        public async Task<IEnumerable<ServiceEntryAction>> GetAllActionsAsync()
        {
            var actions = new List<ServiceEntryAction>();

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetServiceEntryActions", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            actions.Add(new ServiceEntryAction
                            {
                                Id = (Guid)reader["ID"],
                                ServiceEntryId = (Guid)reader["serviceEntryID"],
                                ServiceActionsId = (Guid)reader["serviceActionsID"]
                            });
                        }
                    }
                }
            }

            return actions;
        }

        /// <summary>
        /// Get a specific service entry action by ID using sp_GetServiceEntryActions stored procedure
        /// </summary>
        public async Task<ServiceEntryAction> GetActionByIdAsync(Guid id)
        {
            ServiceEntryAction action = null;

            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_GetServiceEntryActions", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            action = new ServiceEntryAction
                            {
                                Id = (Guid)reader["ID"],
                                ServiceEntryId = (Guid)reader["serviceEntryID"],
                                ServiceActionsId = (Guid)reader["serviceActionsID"]
                            };
                        }
                    }
                }
            }

            return action;
        }

        /// <summary>
        /// Create a new service entry action using sp_InsertServiceEntryActions stored procedure
        /// </summary>
        public async Task<int> CreateActionAsync(ServiceEntryAction action)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_InsertServiceEntryActions", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", action.Id);
                    command.Parameters.AddWithValue("@serviceEntryID", action.ServiceEntryId);
                    command.Parameters.AddWithValue("@serviceActionsID", action.ServiceActionsId);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Update an existing service entry action using sp_UpdateServiceEntryActions stored procedure
        /// </summary>
        public async Task<int> UpdateActionAsync(Guid id, ServiceEntryAction action)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_UpdateServiceEntryActions", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ID", id);
                    command.Parameters.AddWithValue("@serviceEntryID", action.ServiceEntryId == Guid.Empty ? (object)DBNull.Value : action.ServiceEntryId);
                    command.Parameters.AddWithValue("@serviceActionsID", action.ServiceActionsId == Guid.Empty ? (object)DBNull.Value : action.ServiceActionsId);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        /// <summary>
        /// Delete a service entry action using sp_DeleteServiceEntryActions stored procedure
        /// </summary>
        public async Task<int> DeleteActionAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(GetConnectionString()))
            {
                using (SqlCommand command = new SqlCommand("sp_DeleteServiceEntryActions", connection))
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
