using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Request;
using SportsLeague.API.DTOs.Response;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Services;

namespace SportsLeague.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SponsorController : ControllerBase
{
    private readonly ISponsorService _service;
    private readonly IMapper _mapper;

    public SponsorController(ISponsorService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    // ── CRUD ──

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sponsors = await _service.GetAllAsync();
        return Ok(_mapper.Map<IEnumerable<SponsorResponseDTO>>(sponsors));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var sponsor = await _service.GetByIdAsync(id);
        if (sponsor == null) return NotFound();

        return Ok(_mapper.Map<SponsorResponseDTO>(sponsor));
    }

    [HttpPost]
    public async Task<IActionResult> Create(SponsorRequestDTO dto)
    {
        var sponsor = _mapper.Map<Sponsor>(dto);
        var created = await _service.CreateAsync(sponsor);

        return Ok(_mapper.Map<SponsorResponseDTO>(created));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SponsorRequestDTO dto)
    {
        var sponsor = _mapper.Map<Sponsor>(dto);
        await _service.UpdateAsync(id, sponsor);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    // ── RELACIÓN N:M ──

    [HttpPost("{id}/tournaments")]
    public async Task<IActionResult> AssignToTournament(int id, TournamentSponsorRequestDTO dto)
    {
        var relation = await _service.AssignToTournamentAsync(id, dto.TournamentId, dto.ContractAmount);

        var result = _mapper.Map<TournamentSponsorResponseDTO>(relation);

        return Ok(result);
    }

    [HttpGet("{id}/tournaments")]
    public async Task<IActionResult> GetTournaments(int id)
    {
        var tournaments = await _service.GetTournamentsBySponsorAsync(id);

        return Ok(_mapper.Map<IEnumerable<TournamentResponseDTO>>(tournaments));
    }

    [HttpDelete("{id}/tournaments/{tournamentId}")]
    public async Task<IActionResult> RemoveFromTournament(int id, int tournamentId)
    {
        await _service.RemoveFromTournamentAsync(id, tournamentId);
        return NoContent();
    }
}