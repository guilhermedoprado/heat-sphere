package domain

import (
	"errors"
	"math"

	"github.com/google/uuid"
	"heatsphere/go_service/internal/model"
)

// Churchill-Ozoe (1973) correlation for laminar flow over isothermal flat plate.
// Nu_x = 0.3387 * Re_x^0.5 * Pr^(1/3) / [1 + (0.0468/Pr)^(2/3)]^0.25
// Nu_L (average) = 2 * Nu_x at x=L  (Incropera Eq. 7.33)

const laminarReLimit = 5e5

// FlatPlateCaseStudy holds input and computed values.
type FlatPlateCaseStudy struct {
	ID                         uuid.UUID
	Name                       string
	Length                     float64
	Velocity                   float64
	FluidTemperature           float64
	SurfaceTemperature         float64
	FilmTemperature            float64
	KinematicViscosity         float64
	Prandtl                    float64
	ThermalConductivity        float64
	Reynolds                   float64
	NusseltLocal               float64
	NusseltAvg                 float64
	HeatTransferCoefficient    float64
	HeatFlux                   float64
}

// NewFlatPlateCaseStudy creates a case study with film temperature.
func NewFlatPlateCaseStudy(name string, length, velocity, fluidTemp, surfaceTemp float64) *FlatPlateCaseStudy {
	return &FlatPlateCaseStudy{
		ID:                 uuid.New(),
		Name:               name,
		Length:             length,
		Velocity:           velocity,
		FluidTemperature:   fluidTemp,
		SurfaceTemperature: surfaceTemp,
		FilmTemperature:    (fluidTemp + surfaceTemp) / 2,
	}
}

// Calculate uses Churchill-Ozoe correlation.
func (f *FlatPlateCaseStudy) Calculate(props *model.FluidPropertyPoint) error {
	f.KinematicViscosity = props.KinematicViscosity
	f.Prandtl = props.Prandtl
	f.ThermalConductivity = props.ThermalConductivity

	f.Reynolds = (f.Velocity * f.Length) / f.KinematicViscosity

	if f.Reynolds >= laminarReLimit {
		return errors.New("Reynolds exceeds laminar limit (Re_L < 5×10⁵). Use turbulent correlation")
	}

	// Churchill-Ozoe: Nu_x = 0.3387 * Re^0.5 * Pr^(1/3) / [1 + (0.0468/Pr)^(2/3)]^0.25
	prTerm := math.Pow(1+math.Pow(0.0468/f.Prandtl, 2.0/3.0), 0.25)
	if prTerm <= 0 {
		return errors.New("invalid Prandtl term in Churchill-Ozoe")
	}
	f.NusseltLocal = 0.3387 * math.Sqrt(f.Reynolds) * math.Pow(f.Prandtl, 1.0/3.0) / prTerm

	// Average: Nu_L = 2 * Nu_x at x=L
	f.NusseltAvg = 2 * f.NusseltLocal

	f.HeatTransferCoefficient = (f.NusseltAvg * f.ThermalConductivity) / f.Length
	f.HeatFlux = f.HeatTransferCoefficient * (f.SurfaceTemperature - f.FluidTemperature)
	return nil
}
