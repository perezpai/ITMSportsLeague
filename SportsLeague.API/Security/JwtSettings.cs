namespace SportsLeague.API.Security;

/// <summary>
/// Mapea la sección "Jwt" de appsettings/user-secrets. El valor real de Key nunca debe
/// vivir en appsettings.json (queda como placeholder ahí) — se configura por
/// `dotnet user-secrets` en desarrollo o variable de entorno en producción.
/// </summary>
public class JwtSettings
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "SportsLeague.API";
    public string Audience { get; set; } = "SportsLeague.Clients";
    public int ExpiryMinutes { get; set; } = 120;
}
