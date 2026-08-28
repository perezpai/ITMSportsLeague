using System.ComponentModel.DataAnnotations;
using SportsLeague.Domain.Enums;

namespace SportsLeague.API.DTOs.Request;

public class GoalRequestDTO
{
    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse el jugador que anotó")]
    public int PlayerId { get; set; }

    [Range(0, 130, ErrorMessage = "El minuto debe ser un valor válido")]
    public int Minute { get; set; }

    [Required]
    public GoalType Type { get; set; }
}
