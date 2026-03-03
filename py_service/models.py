from pydantic import BaseModel
from uuid import UUID

# --- Shell and Tube Models ---
class RateShellAndTubeInput(BaseModel):
    th_in_c: float
    th_out_c: float
    tc_in_c: float
    tc_out_c: float

class RateShellAndTubeOutput(BaseModel):
    dt1: float
    dt2: float
    lmtd: float
    p: float
    r: float
    f: float
    lmtd_corr: float


# --- Cylinder External Flow Models ---
class CalculateCylinderFlowRequest(BaseModel):
    name: str
    diameter: float
    velocity: float
    fluid_temperature: float
    surface_temperature: float

class CalculateCylinderFlowResponse(BaseModel):
    id: UUID
    name: str
    diameter: float
    velocity: float
    fluid_temperature: float
    surface_temperature: float
    film_temperature: float
    kinematic_viscosity: float
    prandtl: float
    thermal_conductivity: float
    reynolds: float
    nusselt: float
    heat_transfer_coefficient: float
    heat_flux: float

class FluidPropertyPointModel(BaseModel):
    id: UUID
    fluid_id: UUID
    temperature_k: float
    density: float
    specific_heat_at_constant_pressure: float
    dynamic_viscosity: float
    kinematic_viscosity: float
    thermal_conductivity: float
    thermal_diffusivity: float
    prandtl: float
