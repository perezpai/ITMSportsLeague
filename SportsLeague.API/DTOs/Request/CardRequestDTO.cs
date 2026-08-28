using System.ComponentModel.DataAnnotations;
using SportsLeague.Domain.Enums;

namespace SportsLeague.API.DTOs.Request;

public class CardRequestDTO
{
    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse el jugador sancionado")]
    public int PlayerId { get; set; }

    [Range(0, 130, ErrorMessage = "El minuto debe ser un valor válido")]
    public int Minute { get; set; }

    [Required]
    public CardType Type { get; set; }
}
