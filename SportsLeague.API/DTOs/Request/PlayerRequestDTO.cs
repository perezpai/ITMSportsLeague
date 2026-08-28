using System.ComponentModel.DataAnnotations;
using SportsLeague.Domain.Enums;

namespace SportsLeague.API.DTOs.Request;

public class PlayerRequestDTO
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(80, MinimumLength = 1)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio")]
    [StringLength(80, MinimumLength = 1)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public DateTime BirthDate { get; set; }

    [Range(1, 99, ErrorMessage = "El número de camiseta debe estar entre 1 y 99")]
    public int Number { get; set; }

    [Required]
    public PlayerPosition Position { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse un equipo válido")]
    public int TeamId { get; set; }
}
