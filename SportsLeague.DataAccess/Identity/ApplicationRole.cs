using Microsoft.AspNetCore.Identity;

namespace SportsLeague.DataAccess.Identity;

public class ApplicationRole : IdentityRole<int>
{
    public ApplicationRole() : base() { }

    public ApplicationRole(string roleName) : base(roleName) { }

    public string? Description { get; set; }
}
