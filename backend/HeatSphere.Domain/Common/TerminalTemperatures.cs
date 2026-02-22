namespace HeatSphere.Domain.Common;

public sealed record TerminalTemperatures(
    Temperature ThIn,
    Temperature ThOut,
    Temperature TcIn,
    Temperature TcOut);

