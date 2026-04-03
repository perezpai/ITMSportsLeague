using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.Domain.Services;

public class SponsorService : ISponsorService
{
    private readonly ISponsorRepository _repo;
    private readonly ITournamentSponsorRepository _tsRepo;
    private readonly IGenericRepository<Tournament> _tournamentRepo;

    public SponsorService(
        ISponsorRepository repo,
        ITournamentSponsorRepository tsRepo,
        IGenericRepository<Tournament> tournamentRepo)
    {
        _repo = repo;
        _tsRepo = tsRepo;
        _tournamentRepo = tournamentRepo;
    }

    public async Task<IEnumerable<Sponsor>> GetAllAsync()
        => await _repo.GetAllAsync();

    public async Task<Sponsor?> GetByIdAsync(int id)
        => await _repo.GetByIdAsync(id);

    public async Task<Sponsor> CreateAsync(Sponsor sponsor)
    {
        if (await _repo.ExistsByNameAsync(sponsor.Name))
            throw new InvalidOperationException("Sponsor name already exists");

        if (string.IsNullOrWhiteSpace(sponsor.ContactEmail) || !sponsor.ContactEmail.Contains("@"))
            throw new InvalidOperationException("Invalid email");

        return await _repo.CreateAsync(sponsor);
    }

    public async Task UpdateAsync(int id, Sponsor sponsor)
    {
        var existing = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Sponsor not found");

        existing.Name = sponsor.Name;
        existing.ContactEmail = sponsor.ContactEmail;
        existing.Phone = sponsor.Phone;
        existing.WebsiteUrl = sponsor.WebsiteUrl;
        existing.Category = sponsor.Category;

        await _repo.UpdateAsync(existing);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _repo.ExistsAsync(id))
            throw new KeyNotFoundException("Sponsor not found");

        await _repo.DeleteAsync(id);
    }

    public async Task<TournamentSponsor> AssignToTournamentAsync(int sponsorId, int tournamentId, decimal contractAmount)
    {
        if (!await _repo.ExistsAsync(sponsorId))
            throw new KeyNotFoundException("Sponsor not found");

        if (!await _tournamentRepo.ExistsAsync(tournamentId))
            throw new KeyNotFoundException("Tournament not found");

        if (contractAmount <= 0)
            throw new InvalidOperationException("Contract amount must be greater than 0");

        var existing = await _tsRepo.GetByIdsAsync(sponsorId, tournamentId);

        if (existing != null)
            throw new InvalidOperationException("Relationship already exists");

        var relation = new TournamentSponsor
        {
            SponsorId = sponsorId,
            TournamentId = tournamentId,
            ContractAmount = contractAmount,
            JoinedAt = DateTime.UtcNow
        };

        await _tsRepo.CreateAsync(relation);

        var created = await _tsRepo.GetByIdsAsync(sponsorId, tournamentId);

        return created!;
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsBySponsorAsync(int sponsorId)
    {
        if (!await _repo.ExistsAsync(sponsorId))
            throw new KeyNotFoundException("Sponsor not found");

        var relations = await _tsRepo.GetBySponsorIdAsync(sponsorId);

        return relations
            .Where(x => x.Tournament != null)
            .Select(x => x.Tournament!)
            .ToList();
    }

    public async Task RemoveFromTournamentAsync(int sponsorId, int tournamentId)
    {
        if (!await _repo.ExistsAsync(sponsorId))
            throw new KeyNotFoundException("Sponsor not found");

        if (!await _tournamentRepo.ExistsAsync(tournamentId))
            throw new KeyNotFoundException("Tournament not found");

        var relation = await _tsRepo.GetByIdsAsync(sponsorId, tournamentId);

        if (relation == null)
            throw new KeyNotFoundException("Relation not found");

        await _tsRepo.DeleteAsync(relation.Id);
    }
}