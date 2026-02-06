using System;
using System.Collections.Generic;
using System.Text;

using HeatSphere.Domain.Common;
using HeatSphere.Domain.HeatExchangers;

namespace HeatSphere.Application.HeatExchangers;

public sealed record RateShellAndTube12Request(double ThInC, double ThOutC, double TcInC, double TcOutC);

public sealed record RateShellAndTube12Response(
    double DeltaT1,
    double DeltaT2,
    double LmtdCounterflow,
    double P,
    double R,
    double F,
    double LmtdCorrected);

public sealed class RateShellAndTube12WithLmtd
{
    public RateShellAndTube12Response Execute(RateShellAndTube12Request req)
    {
        var temps = new TerminalTemperatures(
            Temperature.FromCelsius(req.ThInC),
            Temperature.FromCelsius(req.ThOutC),
            Temperature.FromCelsius(req.TcInC),
            Temperature.FromCelsius(req.TcOutC));

        // Counterflow ΔT's
        var dT1 = temps.ThIn.Celsius - temps.TcOut.Celsius;
        var dT2 = temps.ThOut.Celsius - temps.TcIn.Celsius;

        if (dT1 <= 0 || dT2 <= 0)
            throw new ArgumentException("Invalid terminal temperatures (ΔT must be > 0).");

        // LMTD (limite quando dT1 ~= dT2)
        double lmtd;
        if (Math.Abs(dT1 - dT2) < 1e-9)
        {
            lmtd = dT1;
        }
        else
        {
            var ratio = dT1 / dT2;
            if (ratio <= 0)
                throw new ArgumentException("Invalid ΔT ratio for LMTD (must be > 0).");

            lmtd = (dT1 - dT2) / Math.Log(ratio);
        }

        // P, R
        var denomP = (temps.ThIn.Celsius - temps.TcIn.Celsius);
        var denomR = (temps.TcOut.Celsius - temps.TcIn.Celsius);

        if (Math.Abs(denomP) < 1e-9 || Math.Abs(denomR) < 1e-9)
            throw new ArgumentException("Invalid temperatures for P/R calculation (division by zero).");

        var P = (temps.TcOut.Celsius - temps.TcIn.Celsius) / denomP;
        var R = (temps.ThIn.Celsius - temps.ThOut.Celsius) / denomR;

        if (Math.Abs(R - 1.0) < 1e-6)
            throw new ArgumentException("Invalid region for F correction (R ≈ 1).");

        if (Math.Abs(1.0 - P) < 1e-6)
            throw new ArgumentException("Invalid region for F correction (P ≈ 1).");

        // F correction
        var S = Math.Sqrt(R * R + 1) / (R - 1);
        var W = (1 - P * R) / (1 - P);

        if (W <= 0)
            throw new ArgumentException("Invalid region for F correction (W must be > 0).");

        var numArg = (1 + W - S + S * W);
        var denArg = (1 + W + S - S * W);

        if (numArg <= 0 || denArg <= 0)
            throw new ArgumentException("Invalid region for F correction (log argument <= 0).");

        var F = (S * Math.Log(W)) / Math.Log(numArg / denArg);

        if (double.IsNaN(F) || double.IsInfinity(F))
            throw new ArgumentException("Invalid region for F correction (NaN/Infinity).");

        var lmtdCorr = F * lmtd;

        return new RateShellAndTube12Response(dT1, dT2, lmtd, P, R, F, lmtdCorr);
    }
}
