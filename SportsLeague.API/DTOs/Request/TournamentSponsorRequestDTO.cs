using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class TournamentSponsorRequestDTO
{
    [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse un torneo válido")]
    public int TournamentId { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "El monto del contrato debe ser mayor a 0")]
    public decimal ContractAmount { get; set; }
}
