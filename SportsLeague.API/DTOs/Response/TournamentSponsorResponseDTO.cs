public class TournamentSponsorResponseDTO
{
    public int Id { get; set; }

    public int SponsorId { get; set; }
    public string SponsorName { get; set; } = string.Empty;

    public int TournamentId { get; set; }
    public string TournamentName { get; set; } = string.Empty;
    public string Season { get; set; } = string.Empty;

    public decimal ContractAmount { get; set; }
    public DateTime JoinedAt { get; set; }
}