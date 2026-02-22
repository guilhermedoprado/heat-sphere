using MediatR;
using Microsoft.AspNetCore.Mvc;
using HeatSphere.Application.Features.ExternalFlow.CalculateCylinder;

namespace HeatSphere.Api.Controllers;

[ApiController]
[Route("api/cylinder")]
public class CylinderFlowController(IMediator mediator) : ControllerBase
{
    [HttpPost("calculate")]
    [ProducesResponseType(typeof(CalculateCylinderFlowResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Calculate([FromBody] CalculateCylinderFlowRequest request)
    {
        try
        {
            var result = await mediator.Send(request);
            return Ok(result);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
