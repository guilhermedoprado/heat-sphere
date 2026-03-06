package domain

import (
	"math"

	"github.com/google/uuid"
	"heatsphere/go_service/internal/model"
)

// CylinderExternalFlowCaseStudy holds input and computed values for cylinder flow.
type CylinderExternalFlowCaseStudy struct {
	ID                         uuid.UUID
	Name                       string
	Diameter                   float64
	Velocity                   float64
	FluidTemperature           float64
	SurfaceTemperature         float64
	FilmTemperature            float64
	KinematicViscosity         float64
	Prandtl                    float64
	ThermalConductivity        float64
	Reynolds                   float64
	Nusselt                    float64
	HeatTransferCoefficient    float64
	HeatFlux                   float64
}

// NewCylinderExternalFlowCaseStudy creates a case study with film temperature.
func NewCylinderExternalFlowCaseStudy(name string, diameter, velocity, fluidTemp, surfaceTemp float64) *CylinderExternalFlowCaseStudy {
	return &CylinderExternalFlowCaseStudy{
		ID:                 uuid.New(),
		Name:               name,
		Diameter:           diameter,
		Velocity:           velocity,
		FluidTemperature:   fluidTemp,
		SurfaceTemperature: surfaceTemp,
		FilmTemperature:    (fluidTemp + surfaceTemp) / 2,
	}
}

// Calculate uses Churchill-Bernstein correlation for Nusselt number.
func (c *CylinderExternalFlowCaseStudy) Calculate(props *model.FluidPropertyPoint) {
	c.KinematicViscosity = props.KinematicViscosity
	c.Prandtl = props.Prandtl
	c.ThermalConductivity = props.ThermalConductivity

	c.Reynolds = (c.Velocity * c.Diameter) / c.KinematicViscosity

	if (c.Reynolds * c.Prandtl) >= 0.2 {
		term1 := 0.62 * math.Pow(c.Reynolds, 0.5) * math.Pow(c.Prandtl, 1.0/3.0)
		term2 := math.Pow(1+math.Pow(0.4/c.Prandtl, 2.0/3.0), 0.25)
		term3 := math.Pow(1+math.Pow(c.Reynolds/282000.0, 5.0/8.0), 0.8)

		c.Nusselt = 0.3 + (term1/term2)*term3
	} else {
		c.Nusselt = 0
	}

	c.HeatTransferCoefficient = (c.Nusselt * c.ThermalConductivity) / c.Diameter
	c.HeatFlux = c.HeatTransferCoefficient * (c.SurfaceTemperature - c.FluidTemperature)
}
