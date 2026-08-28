using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SportsLeague.API.DTOs.Request;
using SportsLeague.API.DTOs.Response;
using SportsLeague.DataAccess.Identity;

namespace SportsLeague.API.Controllers;

/// <summary>
/// Gestión de cuentas de usuario y roles. Solo Admin puede listar cuentas, cambiar
/// roles o activar/desactivar usuarios — es la pieza de "gestión de usuarios y roles"
/// de la fase 1 de nuevas funcionalidades.
/// </summary>
[ApiController]
[Route("api/users")]
[Authorize(Roles = AppRoles.Admin)]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public UsersController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponseDTO>>> GetAll()
    {
        var users = _userManager.Users.ToList();
        var result = new List<UserResponseDTO>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new UserResponseDTO
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FullName = user.FullName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                Roles = roles,
            });
        }

        return Ok(result);
    }

    [HttpPut("{id}/role")]
    public async Task<ActionResult> UpdateRole(int id, UpdateUserRoleDTO dto)
    {
        if (!await _roleManager.RoleExistsAsync(dto.Role))
        {
            return BadRequest(new { message = $"El rol '{dto.Role}' no existe" });
        }

        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { message = $"Usuario con ID {id} no encontrado" });
        }

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.Role);

        return NoContent();
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult> UpdateStatus(int id, UpdateUserStatusDTO dto)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            return NotFound(new { message = $"Usuario con ID {id} no encontrado" });
        }

        user.IsActive = dto.IsActive;

        // Un usuario desactivado no puede seguir logueado con contraseña: se bloquea también
        // el login por Identity para reforzarlo (defensa en profundidad).
        user.LockoutEnabled = true;
        user.LockoutEnd = dto.IsActive ? null : DateTimeOffset.MaxValue;

        await _userManager.UpdateAsync(user);
        return NoContent();
    }
}
