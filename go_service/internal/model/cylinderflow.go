package model

import "github.com/google/uuid"

// CalculateCylinderFlowRequest input for cylinder external flow calculation.
type CalculateCylinderFlowRequest struct {
	Name               string  `json:"name"`
	Diameter           float64 `json:"diameter"`
	Velocity           float64 `json:"velocity"`
	FluidTemperature  float64 `json:"fluid_temperature"`
	SurfaceTemperature float64 `json:"surface_temperature"`
}

// CalculateCylinderFlowResponse full output with all calculated properties.
type CalculateCylinderFlowResponse struct {
	ID                         uuid.UUID `json:"id"`
	Name                       string    `json:"name"`
	Diameter                   float64   `json:"diameter"`
	Velocity                   float64   `json:"velocity"`
	FluidTemperature           float64   `json:"fluid_temperature"`
	SurfaceTemperature         float64   `json:"surface_temperature"`
	FilmTemperature            float64   `json:"film_temperature"`
	KinematicViscosity         float64   `json:"kinematic_viscosity"`
	Prandtl                    float64   `json:"prandtl"`
	ThermalConductivity        float64   `json:"thermal_conductivity"`
	Reynolds                   float64   `json:"reynolds"`
	Nusselt                    float64   `json:"nusselt"`
	HeatTransferCoefficient    float64   `json:"heat_transfer_coefficient"`
	HeatFlux                   float64   `json:"heat_flux"`
}
