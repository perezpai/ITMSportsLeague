using SportsLeague.Domain.Entities;

public interface ISponsorService
{
    Task<IEnumerable<Sponsor>> GetAllAsync();
    Task<Sponsor?> GetByIdAsync(int id);
    Task<Sponsor> CreateAsync(Sponsor sponsor);
    Task UpdateAsync(int id, Sponsor sponsor);
    Task DeleteAsync(int id);
    Task AssignToTournamentAsync(int sponsorId, int tournamentId, decimal contractAmount);
    Task<IEnumerable<Tournament>> GetTournamentsBySponsorAsync(int sponsorId);
    Task RemoveFromTournamentAsync(int sponsorId, int tournamentId);
}