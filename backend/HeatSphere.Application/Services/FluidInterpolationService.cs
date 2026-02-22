using HeatSphere.Domain.Entities;
using HeatSphere.Application.Common.Interfaces;

namespace HeatSphere.Application.Services;

public class FluidInterpolationService(IFluidRepository fluidRepository)
{
    public async Task<FluidPropertyPoint> GetPropertiesForTemperatureAsync(Guid fluidId, double targetTempK)
    {

        var allPoints = await fluidRepository.GetPropertyPointsByFluidIdAsync(fluidId);

        if (allPoints.Count == 0)
            throw new InvalidOperationException($"No property data found for fluid {fluidId}");

        double minTemp = allPoints.First().TemperatureK;
        double maxTemp = allPoints.Last().TemperatureK;

        if (targetTempK < minTemp || targetTempK > maxTemp)
            throw new ArgumentOutOfRangeException(
                nameof(targetTempK),
                $"Temperature {targetTempK}K is out of range [{minTemp}K, {maxTemp}K]");

        FluidPropertyPoint lowerPoint = null;
        FluidPropertyPoint upperPoint = null;

        for (int i = 0; i < allPoints.Count; i++)
        {
            if (allPoints[i].TemperatureK <= targetTempK)
            {
                lowerPoint = allPoints[i];
            }

            if (allPoints[i].TemperatureK >= targetTempK && upperPoint == null)
            {
                upperPoint = allPoints[i];
                break;
            }
        }

        if (lowerPoint != null && Math.Abs(lowerPoint.TemperatureK - targetTempK) < 1e-6)
            return lowerPoint;

        if (upperPoint != null && Math.Abs(upperPoint.TemperatureK - targetTempK) < 1e-6)
            return upperPoint;

        if (lowerPoint == null || upperPoint == null)
            throw new InvalidOperationException("Failed to find bounding temperature points");

        double t1 = lowerPoint.TemperatureK;
        double t2 = upperPoint.TemperatureK;
        double fraction = (targetTempK - t1) / (t2 - t1);

        return new FluidPropertyPoint
        {
            Id = Guid.NewGuid(),
            FluidId = fluidId,
            TemperatureK = targetTempK,
            Density = Interpolate(lowerPoint.Density, upperPoint.Density, fraction),
            SpecificHeatAtConstantPressure = Interpolate(lowerPoint.SpecificHeatAtConstantPressure, upperPoint.SpecificHeatAtConstantPressure, fraction),
            DynamicViscosity = Interpolate(lowerPoint.DynamicViscosity, upperPoint.DynamicViscosity, fraction),
            KinematicViscosity = Interpolate(lowerPoint.KinematicViscosity, upperPoint.KinematicViscosity, fraction),
            ThermalConductivity = Interpolate(lowerPoint.ThermalConductivity, upperPoint.ThermalConductivity, fraction),
            ThermalDiffusivity = Interpolate(lowerPoint.ThermalDiffusivity, upperPoint.ThermalDiffusivity, fraction),
            Prandtl = Interpolate(lowerPoint.Prandtl, upperPoint.Prandtl, fraction)
        };
    }

    private double Interpolate(double y1, double y2, double fraction)
    {
        return y1 + (y2 - y1) * fraction;
    }
}
