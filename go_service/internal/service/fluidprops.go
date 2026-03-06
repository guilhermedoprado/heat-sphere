package service

import (
	"fmt"
	"math"

	"github.com/google/uuid"
	"heatsphere/go_service/internal/model"
)

// Air fluid UUID (matches C# seed).
var AirFluidID = uuid.MustParse("11111111-1111-1111-1111-111111111111")

// Air properties: (tempK, density, cp, dynVisc, kinVisc, thermCond, thermDiff, prandtl)
var airPropertiesData = [][8]float64{
	{100.0, 3.5562, 1032.0, 7.11e-06, 2e-06, 0.00934, 2.54e-06, 0.786},
	{150.0, 2.3364, 1012.0, 1.034e-05, 4.426e-06, 0.0138, 5.84e-06, 0.758},
	{200.0, 1.7458, 1007.0, 1.325e-05, 7.59e-06, 0.0181, 1.03e-05, 0.737},
	{250.0, 1.3947, 1006.0, 1.596e-05, 1.144e-05, 0.0223, 1.59e-05, 0.72},
	{300.0, 1.1614, 1007.0, 1.846e-05, 1.589e-05, 0.0263, 2.25e-05, 0.707},
	{350.0, 0.995, 1009.0, 2.082e-05, 2.092e-05, 0.03, 2.99e-05, 0.7},
	{400.0, 0.8711, 1014.0, 2.301e-05, 2.641e-05, 0.0338, 3.83e-05, 0.69},
	{450.0, 0.774, 1021.0, 2.507e-05, 3.239e-05, 0.0373, 4.72e-05, 0.686},
	{500.0, 0.6964, 1030.0, 2.701e-05, 3.879e-05, 0.0407, 5.67e-05, 0.684},
	{550.0, 0.6329, 1040.0, 2.884e-05, 4.557e-05, 0.0439, 6.67e-05, 0.683},
	{600.0, 0.5804, 1051.0, 3.058e-05, 5.269e-05, 0.0469, 7.69e-05, 0.685},
	{650.0, 0.5356, 1063.0, 3.225e-05, 6.021e-05, 0.0497, 8.73e-05, 0.69},
	{700.0, 0.4975, 1075.0, 3.388e-05, 6.81e-05, 0.0524, 9.8e-05, 0.695},
	{750.0, 0.4643, 1087.0, 3.546e-05, 7.637e-05, 0.0549, 0.000109, 0.702},
	{800.0, 0.4354, 1099.0, 3.698e-05, 8.493e-05, 0.0573, 0.00012, 0.709},
	{850.0, 0.4097, 1110.0, 3.843e-05, 9.38e-05, 0.0596, 0.000131, 0.716},
	{900.0, 0.3868, 1121.0, 3.981e-05, 0.0001029, 0.062, 0.000143, 0.72},
	{950.0, 0.3666, 1131.0, 4.113e-05, 0.0001122, 0.0643, 0.000155, 0.723},
	{1000.0, 0.3482, 1141.0, 4.244e-05, 0.0001219, 0.0667, 0.000168, 0.726},
	{1100.0, 0.3166, 1159.0, 4.49e-05, 0.0001418, 0.0715, 0.000195, 0.728},
	{1200.0, 0.2902, 1175.0, 4.73e-05, 0.0001629, 0.0763, 0.000224, 0.728},
	{1300.0, 0.2679, 1189.0, 4.96e-05, 0.0001851, 0.082, 0.000257, 0.719},
	{1400.0, 0.2488, 1207.0, 5.3e-05, 0.000213, 0.091, 0.000303, 0.703},
	{1500.0, 0.2322, 1230.0, 5.57e-05, 0.00024, 0.1, 0.00035, 0.685},
	{1600.0, 0.2177, 1248.0, 5.84e-05, 0.000268, 0.106, 0.00039, 0.688},
	{1700.0, 0.2049, 1267.0, 6.11e-05, 0.000298, 0.113, 0.000435, 0.685},
	{1800.0, 0.1935, 1286.0, 6.37e-05, 0.000329, 0.12, 0.000482, 0.683},
	{1900.0, 0.1833, 1307.0, 6.63e-05, 0.000362, 0.128, 0.000534, 0.677},
	{2000.0, 0.1741, 1337.0, 6.89e-05, 0.000396, 0.137, 0.000589, 0.672},
	{2100.0, 0.1658, 1372.0, 7.15e-05, 0.000431, 0.147, 0.000646, 0.667},
	{2200.0, 0.1582, 1417.0, 7.4e-05, 0.000468, 0.16, 0.000714, 0.655},
	{2300.0, 0.1513, 1478.0, 7.66e-05, 0.000506, 0.175, 0.000783, 0.647},
	{2400.0, 0.1448, 1558.0, 7.92e-05, 0.000547, 0.196, 0.000869, 0.63},
	{2500.0, 0.1389, 1665.0, 8.18e-05, 0.000589, 0.222, 0.00096, 0.613},
	{3000.0, 0.1135, 2726.0, 9.55e-05, 0.000841, 0.486, 0.00157, 0.536},
}

// FluidInterpolationService provides air properties at arbitrary temperatures.
type FluidInterpolationService struct {
	airPoints []*model.FluidPropertyPoint
}

// NewFluidInterpolationService builds the in-memory air property table.
func NewFluidInterpolationService() *FluidInterpolationService {
	points := make([]*model.FluidPropertyPoint, len(airPropertiesData))
	for i, p := range airPropertiesData {
		points[i] = &model.FluidPropertyPoint{
			ID:                             uuid.New(),
			FluidID:                        AirFluidID,
			TemperatureK:                   p[0],
			Density:                        p[1],
			SpecificHeatAtConstantPressure: p[2],
			DynamicViscosity:               p[3],
			KinematicViscosity:             p[4],
			ThermalConductivity:            p[5],
			ThermalDiffusivity:             p[6],
			Prandtl:                        p[7],
		}
	}
	return &FluidInterpolationService{airPoints: points}
}

// GetPropertiesForTemperature returns interpolated air properties at targetTempK.
func (s *FluidInterpolationService) GetPropertiesForTemperature(fluidID uuid.UUID, targetTempK float64) (*model.FluidPropertyPoint, error) {
	if fluidID != AirFluidID {
		return nil, fmt.Errorf("fluid ID %s not mapped in memory", fluidID)
	}

	pts := s.airPoints
	minTemp := pts[0].TemperatureK
	maxTemp := pts[len(pts)-1].TemperatureK

	if targetTempK < minTemp || targetTempK > maxTemp {
		return nil, fmt.Errorf("temperature %.2fK is out of range [%.1fK, %.1fK]", targetTempK, minTemp, maxTemp)
	}

	var lower, upper *model.FluidPropertyPoint
	for _, p := range pts {
		if p.TemperatureK <= targetTempK {
			lower = p
		}
		if p.TemperatureK >= targetTempK && upper == nil {
			upper = p
			break
		}
	}

	if lower != nil && math.Abs(lower.TemperatureK-targetTempK) < 1e-6 {
		return lower, nil
	}
	if upper != nil && math.Abs(upper.TemperatureK-targetTempK) < 1e-6 {
		return upper, nil
	}

	if lower == nil || upper == nil {
		return nil, fmt.Errorf("failed to find bounding temperature points")
	}

	t1, t2 := lower.TemperatureK, upper.TemperatureK
	fraction := (targetTempK - t1) / (t2 - t1)

	interp := func(y1, y2 float64) float64 { return y1 + (y2-y1)*fraction }

	return &model.FluidPropertyPoint{
		ID:                             uuid.New(),
		FluidID:                        fluidID,
		TemperatureK:                   targetTempK,
		Density:                        interp(lower.Density, upper.Density),
		SpecificHeatAtConstantPressure: interp(lower.SpecificHeatAtConstantPressure, upper.SpecificHeatAtConstantPressure),
		DynamicViscosity:               interp(lower.DynamicViscosity, upper.DynamicViscosity),
		KinematicViscosity:             interp(lower.KinematicViscosity, upper.KinematicViscosity),
		ThermalConductivity:            interp(lower.ThermalConductivity, upper.ThermalConductivity),
		ThermalDiffusivity:             interp(lower.ThermalDiffusivity, upper.ThermalDiffusivity),
		Prandtl:                        interp(lower.Prandtl, upper.Prandtl),
	}, nil
}
