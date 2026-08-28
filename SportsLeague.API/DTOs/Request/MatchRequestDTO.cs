using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class MatchRequestDTO : IValidatableObject
{
    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse un torneo válido")]
    public int TournamentId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse el equipo local")]
    public int HomeTeamId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse el equipo visitante")]
    public int AwayTeamId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse un árbitro válido")]
    public int RefereeId { get; set; }

    [Required]
    public DateTime MatchDate { get; set; }

    [StringLength(150)]
    public string Venue { get; set; } = string.Empty;

    [Range(1, 200, ErrorMessage = "La jornada debe ser un número positivo")]
    public int Matchday { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (HomeTeamId != 0 && AwayTeamId != 0 && HomeTeamId == AwayTeamId)
        {
            yield return new ValidationResult(
                "El equipo local y el visitante no pueden ser el mismo",
                [nameof(AwayTeamId)]);
        }
    }
}
