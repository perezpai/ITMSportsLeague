using System.ComponentModel.DataAnnotations;
using SportsLeague.Domain.Enums;

namespace SportsLeague.API.DTOs.Request;

public class UpdateTournamentStatusDTO
{
    [Required]
    public TournamentStatus Status { get; set; }
}
