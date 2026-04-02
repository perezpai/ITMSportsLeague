using SportsLeague.Domain.Entities;
using SportsLeague.Domain.Interfaces.Repositories;

public interface ISponsorRepository : IGenericRepository<Sponsor>
{
    Task<bool> ExistsByNameAsync(string name);
}