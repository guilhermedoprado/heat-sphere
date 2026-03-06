package model

import "github.com/google/uuid"

// FluidPropertyPoint properties at a given temperature (K).
type FluidPropertyPoint struct {
	ID                              uuid.UUID
	FluidID                         uuid.UUID
	TemperatureK                     float64
	Density                         float64
	SpecificHeatAtConstantPressure  float64
	DynamicViscosity                float64
	KinematicViscosity              float64
	ThermalConductivity             float64
	ThermalDiffusivity              float64
	Prandtl                         float64
}
