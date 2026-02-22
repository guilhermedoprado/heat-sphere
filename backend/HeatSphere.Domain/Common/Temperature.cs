namespace HeatSphere.Domain.Common;

public readonly record struct Temperature(double Celsius)
{
    public double Kelvin => Celsius + 273.15;

    public static Temperature FromCelsius(double c)
    {
        // limite físico (0 K)
        if (c < -273.15) throw new ArgumentOutOfRangeException(nameof(c), "Below absolute zero.");
        return new Temperature(c);
    }
}

