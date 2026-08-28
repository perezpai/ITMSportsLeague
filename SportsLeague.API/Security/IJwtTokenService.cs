using SportsLeague.DataAccess.Identity;

namespace SportsLeague.API.Security;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(ApplicationUser user, IList<string> roles);
}
