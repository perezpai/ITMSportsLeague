using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Request;
using SportsLeague.API.DTOs.Response;
using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using SportsLeague.DataAccess.Identity;

namespace SportsLeague.API.Controllers;

[ApiController]
[Route("api/match/{matchId}/lineup")]
public class MatchLineupController : ControllerBase
{
    private readonly IMatchLineupService _matchLineupService;
    private readonly IMapper _mapper;

    public MatchLineupController(
        IMatchLineupService matchLineupService, IMapper mapper)
    {
        _matchLineupService = matchLineupService;
        _mapper = mapper;
    }

    /// <summary>
    /// Agregar un jugador a la alineación del partido
    /// </summary>
    [Authorize(Roles = AppRoles.MatchOperationRoles)]
    [HttpPost]
    public async Task<ActionResult<MatchLineupDTO>> AddPlayerToLineup(
        int matchId, CreateMatchLineupDTO dto)
    {
        try
        {
            var lineup = _mapper.Map<MatchLineup>(dto);
            var created = await _matchLineupService.RegisterPlayerAsync(matchId, lineup);

            // Obtener la alineación completa y devolver el jugador creado con detalles
            var fullLineup = await _matchLineupService.GetLineupByMatchAsync(matchId);
            var createdLineup = fullLineup.FirstOrDefault(ml => ml.Id == created.Id);

            return CreatedAtAction(nameof(GetMatchLineup), new { matchId }, 
                _mapper.Map<MatchLineupDTO>(createdLineup));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    /// <summary>
    /// Obtener la alineación completa del partido
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MatchLineupDTO>>> GetMatchLineup(int matchId)
    {
        try
        {
            var lineup = await _matchLineupService.GetLineupByMatchAsync(matchId);
            return Ok(_mapper.Map<IEnumerable<MatchLineupDTO>>(lineup));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    /// <summary>
    /// Obtener la alineación de un equipo específico en el partido
    /// </summary>
    [HttpGet("team/{teamId}")]
    public async Task<ActionResult<IEnumerable<MatchLineupDTO>>> GetTeamLineup(int matchId, int teamId)
    {
        try
        {
            var lineup = await _matchLineupService.GetLineupByMatchAndTeamAsync(matchId, teamId);
            return Ok(_mapper.Map<IEnumerable<MatchLineupDTO>>(lineup));
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }

    /// <summary>
    /// Eliminar un jugador de la alineación
    /// </summary>
    [Authorize(Roles = AppRoles.MatchOperationRoles)]
    [HttpDelete("{id}")]
    public async Task<ActionResult> RemovePlayerFromLineup(int matchId, int id)
    {
        try 
        { 
            await _matchLineupService.DeletePlayerAsync(id); 
            return NoContent(); 
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
    }
}
