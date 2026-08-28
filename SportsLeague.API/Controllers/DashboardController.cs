using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Response;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Enums;
using SportsLeague.Domain.Interfaces.Repositories;

namespace SportsLeague.API.Controllers;

/// <summary>
/// Resumen general para la pantalla de inicio del frontend: conteos rápidos y los
/// próximos partidos programados. Es de solo lectura y público, igual que el resto
/// de los endpoints de consulta.
/// </summary>
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IGenericRepository<Team> _teamRepository;
    private readonly IGenericRepository<Player> _playerRepository;
    private readonly IGenericRepository<Tournament> _tournamentRepository;
    private readonly IGenericRepository<Referee> _refereeRepository;
    private readonly IGenericRepository<Sponsor> _sponsorRepository;
    private readonly IMatchRepository _matchRepository;
    private readonly IMapper _mapper;

    public DashboardController(
        IGenericRepository<Team> teamRepository,
        IGenericRepository<Player> playerRepository,
        IGenericRepository<Tournament> tournamentRepository,
        IGenericRepository<Referee> refereeRepository,
        IGenericRepository<Sponsor> sponsorRepository,
        IMatchRepository matchRepository,
        IMapper mapper)
    {
        _teamRepository = teamRepository;
        _playerRepository = playerRepository;
        _tournamentRepository = tournamentRepository;
        _refereeRepository = refereeRepository;
        _sponsorRepository = sponsorRepository;
        _matchRepository = matchRepository;
        _mapper = mapper;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDTO>> GetSummary()
    {
        var teams = await _teamRepository.GetAllAsync();
        var players = await _playerRepository.GetAllAsync();
        var tournaments = await _tournamentRepository.GetAllAsync();
        var referees = await _refereeRepository.GetAllAsync();
        var sponsors = await _sponsorRepository.GetAllAsync();
        var allMatches = await _matchRepository.GetAllAsync();
        var upcoming = await _matchRepository.GetUpcomingWithDetailsAsync(5);

        var summary = new DashboardSummaryDTO
        {
            TotalTeams = teams.Count(),
            TotalPlayers = players.Count(),
            TotalTournaments = tournaments.Count(),
            ActiveTournaments = tournaments.Count(t => t.Status == TournamentStatus.InProgress),
            TotalMatches = allMatches.Count(),
            TotalReferees = referees.Count(),
            TotalSponsors = sponsors.Count(),
            UpcomingMatches = _mapper.Map<IEnumerable<MatchResponseDTO>>(upcoming),
        };

        return Ok(summary);
    }
}
