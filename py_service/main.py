import uuid
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse

from models import (
    RateShellAndTubeInput, RateShellAndTubeOutput,
    CalculateCylinderFlowRequest, CalculateCylinderFlowResponse
)
from domain import ShellAndTubeCalculator, CylinderExternalFlowCaseStudy
from services import FluidInterpolationService, AIR_FLUID_ID

app = FastAPI(title="HeatSphere Math Microservice")

# CORS é tratado pelo nginx gateway (default.conf) para evitar headers duplicados.

# --- Global Exception Handler para ValueErrors ---
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """
    Captura ArgumentException / ValueError do Domínio e converte em HTTP 400
    """
    return JSONResponse(
        status_code=400,
        content={"message": str(exc), "error": "Bad Request"}
    )


# --- Dependency Injection Provider ---
def get_fluid_service() -> FluidInterpolationService:
    return FluidInterpolationService()


# --- Use Case 1: Shell and Tube ---
@app.post("/api/heat-exchangers/shell-tube/rate", response_model=RateShellAndTubeOutput)
async def rate_shell_and_tube_handler(req: RateShellAndTubeInput):
    # O Domain lança ValueError se houver problema, que é pego pelo exception_handler
    result = ShellAndTubeCalculator.execute(
        th_in_c=req.th_in_c,
        th_out_c=req.th_out_c,
        tc_in_c=req.tc_in_c,
        tc_out_c=req.tc_out_c
    )
    return RateShellAndTubeOutput(**result)


# --- Use Case 2: Cylinder External Flow ---
@app.post("/api/external-flow/cylinder/calculate", response_model=CalculateCylinderFlowResponse)
async def calculate_cylinder_flow_handler(
        request: CalculateCylinderFlowRequest,
        fluid_service: FluidInterpolationService = Depends(get_fluid_service)
):
    case_study = CylinderExternalFlowCaseStudy(
        name=request.name,
        diameter=request.diameter,
        velocity=request.velocity,
        fluid_temperature=request.fluid_temperature,
        surface_temperature=request.surface_temperature
    )

    fluid_properties = await fluid_service.get_properties_for_temperature_async(
        AIR_FLUID_ID,
        case_study.film_temperature
    )

    case_study.calculate(fluid_properties)

    return CalculateCylinderFlowResponse(
        id=case_study.id,
        name=case_study.name,
        diameter=case_study.diameter,
        velocity=case_study.velocity,
        fluid_temperature=case_study.fluid_temperature,
        surface_temperature=case_study.surface_temperature,
        film_temperature=case_study.film_temperature,
        kinematic_viscosity=case_study.kinematic_viscosity,
        prandtl=case_study.prandtl,
        thermal_conductivity=case_study.thermal_conductivity,
        reynolds=case_study.reynolds,
        nusselt=case_study.nusselt,
        heat_transfer_coefficient=case_study.heat_transfer_coefficient,
        heat_flux=case_study.heat_flux
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
