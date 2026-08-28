using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class RefereeRequestDTO
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(80, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio")]
    [StringLength(80, MinimumLength = 1)]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La nacionalidad es obligatoria")]
    [StringLength(80)]
    public string Nationality { get; set; } = string.Empty;
}
