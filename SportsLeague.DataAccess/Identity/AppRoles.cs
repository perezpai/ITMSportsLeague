namespace SportsLeague.DataAccess.Identity;

/// <summary>
/// Roles fijos de la aplicación. Se usan como constantes en lugar de strings sueltos
/// para evitar errores de tipeo en los atributos [Authorize(Roles = ...)].
/// </summary>
public static class AppRoles
{
    public const string Admin = "Admin";
    public const string Manager = "Manager";
    public const string Referee = "Referee";
    public const string Viewer = "Viewer";

    public static readonly string[] All = [Admin, Manager, Referee, Viewer];

    /// <summary>Roles que pueden crear/editar/eliminar equipos, jugadores, torneos, etc.</summary>
    public const string ManagementRoles = $"{Admin},{Manager}";

    /// <summary>Roles que además de gestión pueden registrar eventos de partido (goles, tarjetas, alineaciones).</summary>
    public const string MatchOperationRoles = $"{Admin},{Manager},{Referee}";
}
