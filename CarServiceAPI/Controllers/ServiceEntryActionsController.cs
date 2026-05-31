using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [ApiController]
    [Route("api/service-entry-actions")]
    public class ServiceEntryActionsController : ControllerBase
    {
        /// <summary>
        /// Create a new action
        /// </summary>
        [HttpPost]
        public IActionResult CreateAction([FromBody] CreateServiceEntryActionRequest request)
        {
            // Call sp_InsertServiceEntryActions stored procedure
            return Ok(new { message = "Service entry action created successfully" });
        }

        /// <summary>
        /// Get all actions
        /// </summary>
        [HttpGet]
        public IActionResult GetAllActions()
        {
            // Call sp_GetServiceEntryActions stored procedure without ID parameter
            return Ok();
        }

        /// <summary>
        /// Get action by ID
        /// </summary>
        [HttpGet("{id}")]
        public IActionResult GetActionById(Guid id)
        {
            // Call sp_GetServiceEntryActions stored procedure with ID parameter
            return Ok();
        }

        /// <summary>
        /// Update action
        /// </summary>
        [HttpPut("{id}")]
        public IActionResult UpdateAction(Guid id, [FromBody] UpdateServiceEntryActionRequest request)
        {
            // Call sp_UpdateServiceEntryActions stored procedure
            return Ok(new { message = "Service entry action updated successfully" });
        }

        /// <summary>
        /// Delete action
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult DeleteAction(Guid id)
        {
            // Call sp_DeleteServiceEntryActions stored procedure
            return Ok(new { message = "Service entry action deleted successfully" });
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