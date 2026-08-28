using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class TournamentRequestDTO : IValidatableObject
{
    [Required(ErrorMessage = "El nombre del torneo es obligatorio")]
    [StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La temporada es obligatoria")]
    [StringLength(20)]
    public string Season { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDate < StartDate)
        {
            yield return new ValidationResult(
                "La fecha de fin no puede ser anterior a la fecha de inicio",
                [nameof(EndDate)]);
        }
    }
}
