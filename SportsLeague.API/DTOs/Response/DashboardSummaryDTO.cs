namespace SportsLeague.API.DTOs.Response;

public class DashboardSummaryDTO
{
    public int TotalTeams { get; set; }
    public int TotalPlayers { get; set; }
    public int TotalTournaments { get; set; }
    public int ActiveTournaments { get; set; }
    public int TotalMatches { get; set; }
    public int TotalReferees { get; set; }
    public int TotalSponsors { get; set; }
    public IEnumerable<MatchResponseDTO> UpcomingMatches { get; set; } = [];
}
