namespace SportsLeague.API.DTOs.Request;

public class AssignSponsorDTO
{
    public int TournamentId { get; set; }
    public decimal ContractAmount { get; set; }
}