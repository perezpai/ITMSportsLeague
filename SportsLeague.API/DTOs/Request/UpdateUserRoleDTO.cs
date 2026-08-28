using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request;

public class UpdateUserRoleDTO
{
    [Required]
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserStatusDTO
{
    public bool IsActive { get; set; }
}
