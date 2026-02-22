namespace HeatSphere.Application.Features.HeatExchangers.RateShellAndTube;

public sealed record RateShellAndTubeOutput(
    double DeltaT1,
    double DeltaT2,
    double LmtdCounterflow,
    double P,
    double R,
    double F,
    double LmtdCorrected
);