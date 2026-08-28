using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class MatchResultRequestDTO
{
    [Range(0, 99, ErrorMessage = "Los goles del local deben ser un número válido")]
    public int HomeGoals { get; set; }

    [Range(0, 99, ErrorMessage = "Los goles del visitante deben ser un número válido")]
    public int AwayGoals { get; set; }

    [StringLength(500)]
    public string? Observations { get; set; }
}
