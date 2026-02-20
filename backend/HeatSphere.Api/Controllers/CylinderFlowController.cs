using MediatR;
using Microsoft.AspNetCore.Mvc;
using HeatSphere.Application.Features.ExternalFlow.CalculateCylinder;

namespace HeatSphere.Api.Controllers;

[ApiController]
[Route("api/cylinder")]
public class CylinderFlowController : ControllerBase
{
    private readonly IMediator _mediator;

    public CylinderFlowController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("calculate")]
    [ProducesResponseType(typeof(CalculateCylinderFlowResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Calculate([FromBody] CalculateCylinderFlowRequest request)
    {
        try
        {
            var result = await _mediator.Send(request);
            return Ok(result);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            // Retorna erro amigável se a temperatura sair da tabela (ex: > 3000K)
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
