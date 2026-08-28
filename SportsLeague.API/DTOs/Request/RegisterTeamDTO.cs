using System.ComponentModel.DataAnnotations;

namespace SportsLeague.API.DTOs.Request
{
    public class RegisterTeamDTO
    {
        [Range(1, int.MaxValue, ErrorMessage = "Debe indicarse un equipo válido")]
        public int TeamId { get; set; }
    }
}
