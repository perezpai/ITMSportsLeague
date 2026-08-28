import { useEffect, useState } from 'react';
import { standingsApi, tournamentsApi } from '../api/endpoints';
import { toApiError } from '../api/client';
import type { CardStat, Standing, TopScorer, Tournament } from '../api/types';

export function StandingsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [scorers, setScorers] = useState<TopScorer[]>([]);
  const [cards, setCards] = useState<CardStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tournamentsApi.getAll().then((list) => {
      setTournaments(list);
      if (list.length > 0) setTournamentId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (tournamentId == null) return;
    setLoading(true);
    setError(null);
    Promise.all([
      standingsApi.getStandings(tournamentId),
      standingsApi.getTopScorers(tournamentId),
      standingsApi.getCardStats(tournamentId),
    ])
      .then(([s, sc, c]) => {
        setStandings(s);
        setScorers(sc);
        setCards(c);
      })
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tabla de posiciones</h1>
          <p>Clasificación, goleadores y tarjetas por torneo</p>
        </div>
      </div>

      <div className="toolbar">
        <select
          value={tournamentId ?? ''}
          onChange={(e) => setTournamentId(Number(e.target.value))}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — {t.season}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && tournaments.length === 0 && (
        <div className="empty-state">Todavía no hay torneos creados.</div>
      )}

      {loading ? (
        <div className="loading-state">Cargando…</div>
      ) : (
        tournamentId != null && (
          <>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-pad"><h2>Posiciones</h2></div>
              {standings.length === 0 ? (
                <div className="empty-state">Sin datos todavía.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
                      <th>GF</th><th>GC</th><th>DG</th><th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s) => (
                      <tr key={s.teamId}>
                        <td>{s.position}</td>
                        <td>{s.teamName}</td>
                        <td>{s.matchesPlayed}</td>
                        <td>{s.wins}</td>
                        <td>{s.draws}</td>
                        <td>{s.losses}</td>
                        <td>{s.goalsFor}</td>
                        <td>{s.goalsAgainst}</td>
                        <td>{s.goalDifference}</td>
                        <td><strong>{s.points}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="card">
                <div className="card-pad"><h2>Goleadores</h2></div>
                {scorers.length === 0 ? (
                  <div className="empty-state">Sin goles registrados.</div>
                ) : (
                  <table>
                    <thead><tr><th>Jugador</th><th>Equipo</th><th>Goles</th></tr></thead>
                    <tbody>
                      {scorers.map((s) => (
                        <tr key={s.playerId}>
                          <td>{s.playerName}</td>
                          <td>{s.teamName}</td>
                          <td><strong>{s.goals}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="card">
                <div className="card-pad"><h2>Tarjetas</h2></div>
                {cards.length === 0 ? (
                  <div className="empty-state">Sin tarjetas registradas.</div>
                ) : (
                  <table>
                    <thead><tr><th>Jugador</th><th>Equipo</th><th>🟨</th><th>🟥</th></tr></thead>
                    <tbody>
                      {cards.map((c) => (
                        <tr key={c.playerId}>
                          <td>{c.playerName}</td>
                          <td>{c.teamName}</td>
                          <td>{c.yellowCards}</td>
                          <td>{c.redCards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
