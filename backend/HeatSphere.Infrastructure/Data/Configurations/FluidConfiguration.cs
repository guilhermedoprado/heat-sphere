using HeatSphere.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HeatSphere.Infrastructure.Data.Configurations;

public class FluidConfiguration : IEntityTypeConfiguration<Fluid>
{
    public void Configure(EntityTypeBuilder<Fluid> builder)
    {
        // Entity configuration
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Name).IsRequired();

        // Seed data
        builder.HasData(GetAirFluid());
    }

    private static Fluid GetAirFluid()
    {
        var airId = Guid.Parse("11111111-1111-1111-1111-111111111111"); // Fixed Guid for seed

        return new Fluid(airId, "Air");
    }
}
