using Microsoft.AspNetCore.Identity;

namespace SportsLeague.DataAccess.Identity;

/// <summary>
/// Usuario de la aplicación. Extiende IdentityUser para agregar datos propios del dominio
/// (nombre completo, fecha de creación) sin tocar las tablas de negocio existentes.
/// </summary>
public class ApplicationUser : IdentityUser<int>
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
}
