using HeatSphere.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HeatSphere.Infrastructure.Data.Configurations;

public class FluidPropertyPointConfiguration : IEntityTypeConfiguration<FluidPropertyPoint>
{
    public void Configure(EntityTypeBuilder<FluidPropertyPoint> builder)
    {
        // Seed data
        builder.HasData(GetAirProperties());
    }

    private static List<FluidPropertyPoint> GetAirProperties()
    {
        var airId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        return new List<FluidPropertyPoint>
        {
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                FluidId = airId,
                TemperatureK = 100.0,
                Density = 3.5562,
                SpecificHeatAtConstantPressure = 1032.0,
                DynamicViscosity = 7.11e-06,
                KinematicViscosity = 2e-06,
                ThermalConductivity = 0.00934,
                ThermalDiffusivity = 2.54e-06,
                Prandtl = 0.786
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                FluidId = airId,
                TemperatureK = 150.0,
                Density = 2.3364,
                SpecificHeatAtConstantPressure = 1012.0,
                DynamicViscosity = 1.034e-05,
                KinematicViscosity = 4.426e-06,
                ThermalConductivity = 0.0138,
                ThermalDiffusivity = 5.84e-06,
                Prandtl = 0.758
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                FluidId = airId,
                TemperatureK = 200.0,
                Density = 1.7458,
                SpecificHeatAtConstantPressure = 1007.0,
                DynamicViscosity = 1.325e-05,
                KinematicViscosity = 7.59e-06,
                ThermalConductivity = 0.0181,
                ThermalDiffusivity = 1.03e-05,
                Prandtl = 0.737
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                FluidId = airId,
                TemperatureK = 250.0,
                Density = 1.3947,
                SpecificHeatAtConstantPressure = 1006.0,
                DynamicViscosity = 1.596e-05,
                KinematicViscosity = 1.144e-05,
                ThermalConductivity = 0.0223,
                ThermalDiffusivity = 1.59e-05,
                Prandtl = 0.72
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                FluidId = airId,
                TemperatureK = 300.0,
                Density = 1.1614,
                SpecificHeatAtConstantPressure = 1007.0,
                DynamicViscosity = 1.846e-05,
                KinematicViscosity = 1.589e-05,
                ThermalConductivity = 0.0263,
                ThermalDiffusivity = 2.25e-05,
                Prandtl = 0.707
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                FluidId = airId,
                TemperatureK = 350.0,
                Density = 0.995,
                SpecificHeatAtConstantPressure = 1009.0,
                DynamicViscosity = 2.082e-05,
                KinematicViscosity = 2.092e-05,
                ThermalConductivity = 0.03,
                ThermalDiffusivity = 2.99e-05,
                Prandtl = 0.7
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                FluidId = airId,
                TemperatureK = 400.0,
                Density = 0.8711,
                SpecificHeatAtConstantPressure = 1014.0,
                DynamicViscosity = 2.301e-05,
                KinematicViscosity = 2.641e-05,
                ThermalConductivity = 0.0338,
                ThermalDiffusivity = 3.83e-05,
                Prandtl = 0.69
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000008"),
                FluidId = airId,
                TemperatureK = 450.0,
                Density = 0.774,
                SpecificHeatAtConstantPressure = 1021.0,
                DynamicViscosity = 2.507e-05,
                KinematicViscosity = 3.239e-05,
                ThermalConductivity = 0.0373,
                ThermalDiffusivity = 4.72e-05,
                Prandtl = 0.686
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000009"),
                FluidId = airId,
                TemperatureK = 500.0,
                Density = 0.6964,
                SpecificHeatAtConstantPressure = 1030.0,
                DynamicViscosity = 2.701e-05,
                KinematicViscosity = 3.879e-05,
                ThermalConductivity = 0.0407,
                ThermalDiffusivity = 5.67e-05,
                Prandtl = 0.684
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000010"),
                FluidId = airId,
                TemperatureK = 550.0,
                Density = 0.6329,
                SpecificHeatAtConstantPressure = 1040.0,
                DynamicViscosity = 2.884e-05,
                KinematicViscosity = 4.557e-05,
                ThermalConductivity = 0.0439,
                ThermalDiffusivity = 6.67e-05,
                Prandtl = 0.683
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000011"),
                FluidId = airId,
                TemperatureK = 600.0,
                Density = 0.5804,
                SpecificHeatAtConstantPressure = 1051.0,
                DynamicViscosity = 3.058e-05,
                KinematicViscosity = 5.269e-05,
                ThermalConductivity = 0.0469,
                ThermalDiffusivity = 7.69e-05,
                Prandtl = 0.685
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000012"),
                FluidId = airId,
                TemperatureK = 650.0,
                Density = 0.5356,
                SpecificHeatAtConstantPressure = 1063.0,
                DynamicViscosity = 3.225e-05,
                KinematicViscosity = 6.021e-05,
                ThermalConductivity = 0.0497,
                ThermalDiffusivity = 8.73e-05,
                Prandtl = 0.69
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000013"),
                FluidId = airId,
                TemperatureK = 700.0,
                Density = 0.4975,
                SpecificHeatAtConstantPressure = 1075.0,
                DynamicViscosity = 3.388e-05,
                KinematicViscosity = 6.81e-05,
                ThermalConductivity = 0.0524,
                ThermalDiffusivity = 9.8e-05,
                Prandtl = 0.695
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000014"),
                FluidId = airId,
                TemperatureK = 750.0,
                Density = 0.4643,
                SpecificHeatAtConstantPressure = 1087.0,
                DynamicViscosity = 3.546e-05,
                KinematicViscosity = 7.637e-05,
                ThermalConductivity = 0.0549,
                ThermalDiffusivity = 0.000109,
                Prandtl = 0.702
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000015"),
                FluidId = airId,
                TemperatureK = 800.0,
                Density = 0.4354,
                SpecificHeatAtConstantPressure = 1099.0,
                DynamicViscosity = 3.698e-05,
                KinematicViscosity = 8.493e-05,
                ThermalConductivity = 0.0573,
                ThermalDiffusivity = 0.00012,
                Prandtl = 0.709
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000016"),
                FluidId = airId,
                TemperatureK = 850.0,
                Density = 0.4097,
                SpecificHeatAtConstantPressure = 1110.0,
                DynamicViscosity = 3.843e-05,
                KinematicViscosity = 9.38e-05,
                ThermalConductivity = 0.0596,
                ThermalDiffusivity = 0.000131,
                Prandtl = 0.716
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000017"),
                FluidId = airId,
                TemperatureK = 900.0,
                Density = 0.3868,
                SpecificHeatAtConstantPressure = 1121.0,
                DynamicViscosity = 3.981e-05,
                KinematicViscosity = 0.0001029,
                ThermalConductivity = 0.062,
                ThermalDiffusivity = 0.000143,
                Prandtl = 0.72
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000018"),
                FluidId = airId,
                TemperatureK = 950.0,
                Density = 0.3666,
                SpecificHeatAtConstantPressure = 1131.0,
                DynamicViscosity = 4.113e-05,
                KinematicViscosity = 0.0001122,
                ThermalConductivity = 0.0643,
                ThermalDiffusivity = 0.000155,
                Prandtl = 0.723
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000019"),
                FluidId = airId,
                TemperatureK = 1000.0,
                Density = 0.3482,
                SpecificHeatAtConstantPressure = 1141.0,
                DynamicViscosity = 4.244e-05,
                KinematicViscosity = 0.0001219,
                ThermalConductivity = 0.0667,
                ThermalDiffusivity = 0.000168,
                Prandtl = 0.726
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000020"),
                FluidId = airId,
                TemperatureK = 1100.0,
                Density = 0.3166,
                SpecificHeatAtConstantPressure = 1159.0,
                DynamicViscosity = 4.49e-05,
                KinematicViscosity = 0.0001418,
                ThermalConductivity = 0.0715,
                ThermalDiffusivity = 0.000195,
                Prandtl = 0.728
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000021"),
                FluidId = airId,
                TemperatureK = 1200.0,
                Density = 0.2902,
                SpecificHeatAtConstantPressure = 1175.0,
                DynamicViscosity = 4.73e-05,
                KinematicViscosity = 0.0001629,
                ThermalConductivity = 0.0763,
                ThermalDiffusivity = 0.000224,
                Prandtl = 0.728
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000022"),
                FluidId = airId,
                TemperatureK = 1300.0,
                Density = 0.2679,
                SpecificHeatAtConstantPressure = 1189.0,
                DynamicViscosity = 4.96e-05,
                KinematicViscosity = 0.0001851,
                ThermalConductivity = 0.082,
                ThermalDiffusivity = 0.000257,
                Prandtl = 0.719
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000023"),
                FluidId = airId,
                TemperatureK = 1400.0,
                Density = 0.2488,
                SpecificHeatAtConstantPressure = 1207.0,
                DynamicViscosity = 5.3e-05,
                KinematicViscosity = 0.000213,
                ThermalConductivity = 0.091,
                ThermalDiffusivity = 0.000303,
                Prandtl = 0.703
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000024"),
                FluidId = airId,
                TemperatureK = 1500.0,
                Density = 0.2322,
                SpecificHeatAtConstantPressure = 1230.0,
                DynamicViscosity = 5.57e-05,
                KinematicViscosity = 0.00024,
                ThermalConductivity = 0.1,
                ThermalDiffusivity = 0.00035,
                Prandtl = 0.685
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000025"),
                FluidId = airId,
                TemperatureK = 1600.0,
                Density = 0.2177,
                SpecificHeatAtConstantPressure = 1248.0,
                DynamicViscosity = 5.84e-05,
                KinematicViscosity = 0.000268,
                ThermalConductivity = 0.106,
                ThermalDiffusivity = 0.00039,
                Prandtl = 0.688
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000026"),
                FluidId = airId,
                TemperatureK = 1700.0,
                Density = 0.2049,
                SpecificHeatAtConstantPressure = 1267.0,
                DynamicViscosity = 6.11e-05,
                KinematicViscosity = 0.000298,
                ThermalConductivity = 0.113,
                ThermalDiffusivity = 0.000435,
                Prandtl = 0.685
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000027"),
                FluidId = airId,
                TemperatureK = 1800.0,
                Density = 0.1935,
                SpecificHeatAtConstantPressure = 1286.0,
                DynamicViscosity = 6.37e-05,
                KinematicViscosity = 0.000329,
                ThermalConductivity = 0.12,
                ThermalDiffusivity = 0.000482,
                Prandtl = 0.683
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000028"),
                FluidId = airId,
                TemperatureK = 1900.0,
                Density = 0.1833,
                SpecificHeatAtConstantPressure = 1307.0,
                DynamicViscosity = 6.63e-05,
                KinematicViscosity = 0.000362,
                ThermalConductivity = 0.128,
                ThermalDiffusivity = 0.000534,
                Prandtl = 0.677
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000029"),
                FluidId = airId,
                TemperatureK = 2000.0,
                Density = 0.1741,
                SpecificHeatAtConstantPressure = 1337.0,
                DynamicViscosity = 6.89e-05,
                KinematicViscosity = 0.000396,
                ThermalConductivity = 0.137,
                ThermalDiffusivity = 0.000589,
                Prandtl = 0.672
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000030"),
                FluidId = airId,
                TemperatureK = 2100.0,
                Density = 0.1658,
                SpecificHeatAtConstantPressure = 1372.0,
                DynamicViscosity = 7.15e-05,
                KinematicViscosity = 0.000431,
                ThermalConductivity = 0.147,
                ThermalDiffusivity = 0.000646,
                Prandtl = 0.667
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000031"),
                FluidId = airId,
                TemperatureK = 2200.0,
                Density = 0.1582,
                SpecificHeatAtConstantPressure = 1417.0,
                DynamicViscosity = 7.4e-05,
                KinematicViscosity = 0.000468,
                ThermalConductivity = 0.16,
                ThermalDiffusivity = 0.000714,
                Prandtl = 0.655
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000032"),
                FluidId = airId,
                TemperatureK = 2300.0,
                Density = 0.1513,
                SpecificHeatAtConstantPressure = 1478.0,
                DynamicViscosity = 7.66e-05,
                KinematicViscosity = 0.000506,
                ThermalConductivity = 0.175,
                ThermalDiffusivity = 0.000783,
                Prandtl = 0.647
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000033"),
                FluidId = airId,
                TemperatureK = 2400.0,
                Density = 0.1448,
                SpecificHeatAtConstantPressure = 1558.0,
                DynamicViscosity = 7.92e-05,
                KinematicViscosity = 0.000547,
                ThermalConductivity = 0.196,
                ThermalDiffusivity = 0.000869,
                Prandtl = 0.63
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000034"),
                FluidId = airId,
                TemperatureK = 2500.0,
                Density = 0.1389,
                SpecificHeatAtConstantPressure = 1665.0,
                DynamicViscosity = 8.18e-05,
                KinematicViscosity = 0.000589,
                ThermalConductivity = 0.222,
                ThermalDiffusivity = 0.00096,
                Prandtl = 0.613
            },
            new FluidPropertyPoint
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000035"),
                FluidId = airId,
                TemperatureK = 3000.0,
                Density = 0.1135,
                SpecificHeatAtConstantPressure = 2726.0,
                DynamicViscosity = 9.55e-05,
                KinematicViscosity = 0.000841,
                ThermalConductivity = 0.486,
                ThermalDiffusivity = 0.00157,
                Prandtl = 0.536
            },
        };
    }
}   
