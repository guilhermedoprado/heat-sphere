package model

import "github.com/google/uuid"

// CalculateFlatPlateRequest input for flat plate laminar flow (Churchill-Ozoe).
type CalculateFlatPlateRequest struct {
	Name               string  `json:"name"`
	Length             float64 `json:"length"`               // L (m) - plate length
	Velocity           float64 `json:"velocity"`             // U∞ (m/s)
	FluidTemperature   float64 `json:"fluid_temperature"`    // T∞ (K)
	SurfaceTemperature float64 `json:"surface_temperature"`  // Ts (K)
}

// CalculateFlatPlateResponse full output (Churchill-Ozoe, Eq. 7.33 Incropera).
type CalculateFlatPlateResponse struct {
	ID                         uuid.UUID `json:"id"`
	Name                       string    `json:"name"`
	Length                     float64   `json:"length"`
	Velocity                   float64   `json:"velocity"`
	FluidTemperature           float64   `json:"fluid_temperature"`
	SurfaceTemperature         float64   `json:"surface_temperature"`
	FilmTemperature            float64   `json:"film_temperature"`
	KinematicViscosity         float64   `json:"kinematic_viscosity"`
	Prandtl                    float64   `json:"prandtl"`
	ThermalConductivity        float64   `json:"thermal_conductivity"`
	Reynolds                   float64   `json:"reynolds"`
	NusseltLocal               float64   `json:"nusselt_local"`   // Nu_x at x=L
	NusseltAvg                 float64   `json:"nusselt_avg"`     // Nu_L = 2*Nu_x
	HeatTransferCoefficient    float64   `json:"heat_transfer_coefficient"`
	HeatFlux                   float64   `json:"heat_flux"`
}
