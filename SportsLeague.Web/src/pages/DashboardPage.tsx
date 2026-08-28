import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/endpoints';
import { toApiError } from '../api/client';
import type { DashboardSummary } from '../api/types';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../auth/AuthContext';

const statusLabel: Record<string, string> = {
  Scheduled: 'Programado',
  InProgress: 'En curso',
  Finished: 'Finalizado',
  Suspended: 'Suspendido',
};

export function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi
      .getSummary()
      .then(setSummary)
      .catch((err) => setError(toApiError(err).message));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hola, {user?.fullName?.split(' ')[0]}</h1>
          <p>Resumen general de la liga</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {summary && (
        <>
          <div className="stat-grid">
            <StatCard label="Equipos" value={summary.totalTeams} />
            <StatCard label="Jugadores" value={summary.totalPlayers} />
            <StatCard label="Torneos" value={summary.totalTournaments} />
            <StatCard label="Torneos activos" value={summary.activeTournaments} />
            <StatCard label="Partidos" value={summary.totalMatches} />
            <StatCard label="Árbitros" value={summary.totalReferees} />
            <StatCard label="Patrocinadores" value={summary.totalSponsors} />
          </div>

          <div className="card">
            <div className="card-pad">
              <h2>Próximos partidos</h2>
            </div>
            {summary.upcomingMatches.length === 0 ? (
              <div className="empty-state">No hay partidos programados próximamente.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Torneo</th>
                    <th>Partido</th>
                    <th>Sede</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.upcomingMatches.map((m) => (
                    <tr key={m.id}>
                      <td>{new Date(m.matchDate).toLocaleString()}</td>
                      <td>{m.tournamentName}</td>
                      <td>{m.homeTeamName} vs {m.awayTeamName}</td>
                      <td>{m.venue}</td>
                      <td>
                        <span className="badge">{statusLabel[m.status] ?? m.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
