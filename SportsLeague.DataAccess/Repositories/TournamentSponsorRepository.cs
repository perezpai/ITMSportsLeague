using Microsoft.EntityFrameworkCore;
using SportsLeague.DataAccess.Context;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;

namespace SportsLeague.DataAccess.Repositories;

public class TournamentSponsorRepository
    : GenericRepository<TournamentSponsor>, ITournamentSponsorRepository
{
    public TournamentSponsorRepository(LeagueDbContext context) : base(context)
    {
    }

    public async Task<TournamentSponsor?> GetByIdsAsync(int sponsorId, int tournamentId)
    {
        return await _context.TournamentSponsors
            .Include(ts => ts.Sponsor)
            .Include(ts => ts.Tournament)
            .FirstOrDefaultAsync(ts =>
                ts.SponsorId == sponsorId &&
                ts.TournamentId == tournamentId);
    }

    public async Task<IEnumerable<TournamentSponsor>> GetBySponsorIdAsync(int sponsorId)
    {
        return await _dbSet
            .Include(ts => ts.Tournament)
            .Where(ts => ts.SponsorId == sponsorId)
            .ToListAsync();
    }
}