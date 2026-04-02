using SportsLeague.Domain.Entities;

namespace SportsLeague.Domain.Interfaces.Repositories;

public interface ITournamentSponsorRepository : IGenericRepository<TournamentSponsor>
{
    Task<TournamentSponsor?> GetByIdsAsync(int sponsorId, int tournamentId);
    Task<IEnumerable<TournamentSponsor>> GetBySponsorIdAsync(int sponsorId);
}