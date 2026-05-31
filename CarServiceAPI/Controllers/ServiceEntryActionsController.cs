using CarServiceAPI.Models;
using CarServiceAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/service-entry-actions")]
    public class ServiceEntryActionsController : ControllerBase
    {
        private readonly IServiceEntryActionsService _actionService;

        public ServiceEntryActionsController(IServiceEntryActionsService actionService)
        {
            _actionService = actionService;
        }

        /// <summary>
        /// Create a new service entry action
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateAction([FromBody] CreateServiceEntryActionRequest request)
        {
            try
            {
                var action = new ServiceEntryAction
                {
                    Id = request.Id,
                    ServiceEntryId = request.ServiceEntryId,
                    ServiceActionsId = request.ServiceActionsId
                };

                var result = await _actionService.CreateActionAsync(action);
                return Ok(new { message = "Service entry action created successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all service entry actions
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllActions()
        {
            try
            {
                var actions = await _actionService.GetAllActionsAsync();
                return Ok(actions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get service entry action by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActionById(Guid id)
        {
            try
            {
                var action = await _actionService.GetActionByIdAsync(id);
                if (action == null)
                    return NotFound(new { message = "Service entry action not found" });

                return Ok(action);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update a service entry action
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAction(Guid id, [FromBody] UpdateServiceEntryActionRequest request)
        {
            try
            {
                var action = new ServiceEntryAction
                {
                    Id = id,
                    ServiceEntryId = request.ServiceEntryId ?? Guid.Empty,
                    ServiceActionsId = request.ServiceActionsId ?? Guid.Empty
                };

                var result = await _actionService.UpdateActionAsync(id, action);
                return Ok(new { message = "Service entry action updated successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a service entry action
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAction(Guid id)
        {
            try
            {
                var result = await _actionService.DeleteActionAsync(id);
                return Ok(new { message = "Service entry action deleted successfully", rowsAffected = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateServiceEntryActionRequest
    {
        public Guid Id { get; set; }
        public Guid ServiceEntryId { get; set; }
        public Guid ServiceActionsId { get; set; }
    }

    public class UpdateServiceEntryActionRequest
    {
        public Guid? ServiceEntryId { get; set; }
        public Guid? ServiceActionsId { get; set; }
    }
}
