using Microsoft.AspNetCore.Mvc;
using HeatSphere.Application.Features.HeatExchangers.RateShellAndTube;

namespace HeatSphere.Api.Controllers;

[ApiController]
[Route("api/heat-exchangers/shell-tube/1-2/rating")]
public sealed class HeatExchangersController(RateShellAndTubeHandler handler) : ControllerBase
{
    [HttpPost]
    public IActionResult Create([FromBody] RateShellAndTubeInput input)
    {
        var result = handler.Execute(input); 
        
        return Ok(result);
    }
}
