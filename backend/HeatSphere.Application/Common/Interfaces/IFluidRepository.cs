using HeatSphere.Domain.Entities;

namespace HeatSphere.Application.Common.Interfaces;

public interface IFluidRepository
{
    Task<List<FluidPropertyPoint>> GetPropertyPointsByFluidIdAsync(Guid fluidId);
}
