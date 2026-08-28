using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class TeamRequestDTO
{
    [Required(ErrorMessage = "El nombre del equipo es obligatorio")]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La ciudad es obligatoria")]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "El estadio es obligatorio")]
    [StringLength(150)]
    public string Stadium { get; set; } = string.Empty;

    [StringLength(500)]
    [Url(ErrorMessage = "LogoUrl debe ser una URL válida")]
    public string? LogoUrl { get; set; }

    [Required]
    public DateTime FoundedDate { get; set; }
}
