using HeatSphere.Application.Common.Interfaces;
using HeatSphere.Domain.Entities;
using HeatSphere.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HeatSphere.Infrastructure.Repositories;

public class FluidRepository(AppDbContext context) : IFluidRepository
{
    public async Task<List<FluidPropertyPoint>> GetPropertyPointsByFluidIdAsync(Guid fluidId)
    {
        return await context.FluidPropertyPoints
            .Where(p => p.FluidId == fluidId)
            .OrderBy(p => p.TemperatureK)
            .ToListAsync();
    }
}
