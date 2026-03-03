import math
from uuid import uuid4
from models import FluidPropertyPointModel


# --- Shell and Tube Domain Logic ---
class ShellAndTubeCalculator:
    @staticmethod
    def execute(th_in_c: float, th_out_c: float, tc_in_c: float, tc_out_c: float) -> dict:
        dt1 = th_in_c - tc_out_c
        dt2 = th_out_c - tc_in_c

        if dt1 <= 0 or dt2 <= 0:
            raise ValueError("Invalid terminal temperatures (ΔT must be > 0).")

        if abs(dt1 - dt2) < 1e-9:
            lmtd = dt1
        else:
            ratio = dt1 / dt2
            if ratio <= 0:
                raise ValueError("Invalid ΔT ratio for LMTD (must be > 0).")
            lmtd = (dt1 - dt2) / math.log(ratio)

        denom_p = th_in_c - tc_in_c
        denom_r = tc_out_c - tc_in_c

        if abs(denom_p) < 1e-9 or abs(denom_r) < 1e-9:
            raise ValueError("Invalid temperatures for P/R calculation (division by zero).")

        p = (tc_out_c - tc_in_c) / denom_p
        r = (th_in_c - th_out_c) / denom_r

        if abs(r - 1.0) < 1e-6:
            raise ValueError("Invalid region for F correction (R ≈ 1).")
        if abs(1.0 - p) < 1e-6:
            raise ValueError("Invalid region for F correction (P ≈ 1).")

        s = math.sqrt(r * r + 1) / (r - 1)
        w = (1 - p * r) / (1 - p)

        if w <= 0:
            raise ValueError("Invalid region for F correction (W must be > 0).")

        num_arg = 1 + w - s + s * w
        den_arg = 1 + w + s - s * w

        if num_arg <= 0 or den_arg <= 0:
            raise ValueError("Invalid region for F correction (log argument <= 0).")

        f = (s * math.log(w)) / math.log(num_arg / den_arg)

        if math.isnan(f) or math.isinf(f):
            raise ValueError("Invalid region for F correction (NaN/Infinity).")

        lmtd_corr = f * lmtd

        return {
            "dt1": dt1, "dt2": dt2, "lmtd": lmtd,
            "p": p, "r": r, "f": f, "lmtd_corr": lmtd_corr
        }


# --- Cylinder Flow Domain Logic ---
class CylinderExternalFlowCaseStudy:
    def __init__(self, name: str, diameter: float, velocity: float,
                 fluid_temperature: float, surface_temperature: float):
        self.id = uuid4()
        self.name = name
        self.diameter = diameter
        self.velocity = velocity
        self.fluid_temperature = fluid_temperature
        self.surface_temperature = surface_temperature

        self.film_temperature = (fluid_temperature + surface_temperature) / 2.0

        self.kinematic_viscosity = 0.0
        self.prandtl = 0.0
        self.thermal_conductivity = 0.0
        self.reynolds = 0.0
        self.nusselt = 0.0
        self.heat_transfer_coefficient = 0.0
        self.heat_flux = 0.0

    def calculate(self, interpolated_props: FluidPropertyPointModel):
        self.kinematic_viscosity = interpolated_props.kinematic_viscosity
        self.prandtl = interpolated_props.prandtl
        self.thermal_conductivity = interpolated_props.thermal_conductivity

        self.reynolds = (self.velocity * self.diameter) / self.kinematic_viscosity

        if (self.reynolds * self.prandtl) >= 0.2:
            term1 = 0.62 * math.pow(self.reynolds, 0.5) * math.pow(self.prandtl, 1.0 / 3.0)
            term2 = math.pow(1 + math.pow(0.4 / self.prandtl, 2.0 / 3.0), 0.25)
            term3 = math.pow(1 + math.pow(self.reynolds / 282000.0, 5.0 / 8.0), 0.8)

            self.nusselt = 0.3 + (term1 / term2) * term3
        else:
            self.nusselt = 0.0

        self.heat_transfer_coefficient = (self.nusselt * self.thermal_conductivity) / self.diameter
        self.heat_flux = self.heat_transfer_coefficient * (self.surface_temperature - self.fluid_temperature)
