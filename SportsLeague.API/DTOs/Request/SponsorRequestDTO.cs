using System.ComponentModel.DataAnnotations;
using SportsLeague.Domain.Enums;

namespace SportsLeague.API.DTOs.Request;

public class SponsorRequestDTO
{
    [Required(ErrorMessage = "El nombre del patrocinador es obligatorio")]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email de contacto es obligatorio")]
    [EmailAddress(ErrorMessage = "El email no tiene un formato válido")]
    public string ContactEmail { get; set; } = string.Empty;

    [StringLength(20)]
    [Phone(ErrorMessage = "El teléfono no tiene un formato válido")]
    public string? Phone { get; set; }

    [StringLength(250)]
    [Url(ErrorMessage = "WebsiteUrl debe ser una URL válida")]
    public string? WebsiteUrl { get; set; }

    [Required]
    public SponsorCategory Category { get; set; }
}
