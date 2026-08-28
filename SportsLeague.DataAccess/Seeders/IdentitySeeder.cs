using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SportsLeague.DataAccess.Identity;

namespace SportsLeague.DataAccess.Seeders;

/// <summary>
/// Crea los roles fijos de la aplicación y, si no existe ningún usuario todavía,
/// un usuario Admin inicial para poder entrar al sistema por primera vez.
/// La contraseña del Admin se toma de configuración (Seed:AdminPassword) para no
/// dejar una credencial fija dentro del código fuente.
/// </summary>
public static class IdentitySeeder
{
    public static async Task SeedAsync(
        RoleManager<ApplicationRole> roleManager,
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        foreach (var roleName in AppRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new ApplicationRole(roleName));
            }
        }

        if (userManager.Users.Any())
        {
            return;
        }

        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@sportsleague.local";
        var adminPassword = configuration["Seed:AdminPassword"];

        if (string.IsNullOrWhiteSpace(adminPassword))
        {
            // Sin contraseña configurada no se crea el admin: evita subir una contraseña
            // por defecto adivinable a un ambiente compartido. Ver README para configurarla
            // con `dotnet user-secrets set "Seed:AdminPassword" "..."`.
            return;
        }

        var admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FullName = "Administrador",
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(admin, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(admin, AppRoles.Admin);
        }
    }
}
