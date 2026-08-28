using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class RegisterRequestDTO
{
    [Required(ErrorMessage = "El nombre completo es obligatorio")]
    [StringLength(150, MinimumLength = 2)]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "El email no tiene un formato válido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Rol solicitado para la cuenta nueva (Manager, Referee, Viewer). Nunca se acepta "Admin"
    /// desde el registro público: los administradores se crean por seed o los promueve otro Admin.
    /// </summary>
    public string? RequestedRole { get; set; }
}
