using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class CreateMatchLineupDTO
{
    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse el jugador")]
    public int PlayerId { get; set; }

    public bool IsStarter { get; set; }

    [Required(ErrorMessage = "La posición es obligatoria")]
    [StringLength(10)]
    public string Position { get; set; } = string.Empty;
}
