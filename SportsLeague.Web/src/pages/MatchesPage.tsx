import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { matchesApi, refereesApi, teamsApi, tournamentsApi } from '../api/endpoints';
import { toApiError } from '../api/client';
import type { ApiError } from '../api/client';
import type { Match, MatchStatus, Referee, Team, Tournament } from '../api/types';
import { useAuth } from '../auth/AuthContext';

const statusLabel: Record<MatchStatus, string> = {
  Scheduled: 'Programado',
  InProgress: 'En curso',
  Finished: 'Finalizado',
  Suspended: 'Suspendido',
};

const statusOptions: MatchStatus[] = ['Scheduled', 'InProgress', 'Finished', 'Suspended'];

const emptyForm = {
  homeTeamId: '',
  awayTeamId: '',
  refereeId: '',
  matchDate: '',
  venue: '',
  matchday: 1,
};

export function MatchesPage() {
  const { hasRole } = useAuth();
  const canManage = hasRole('Admin', 'Manager');
  const canOperate = hasRole('Admin', 'Manager', 'Referee');

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Match | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([tournamentsApi.getAll(), teamsApi.getAll(), refereesApi.getAll()]).then(
      ([t, tm, r]) => {
        setTournaments(t);
        setTeams(tm);
        setReferees(r);
        if (t.length > 0) setTournamentId(t[0].id);
      },
    );
  }, []);

  const loadMatches = () => {
    if (tournamentId == null) return;
    setLoading(true);
    setError(null);
    matchesApi
      .getByTournament(tournamentId)
      .then(setMatches)
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(loadMatches, [tournamentId]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (m: Match) => {
    setEditing(m);
    setForm({
      homeTeamId: String(m.homeTeamId),
      awayTeamId: String(m.awayTeamId),
      refereeId: String(m.refereeId),
      matchDate: m.matchDate.slice(0, 16),
      venue: m.venue,
      matchday: m.matchday,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (tournamentId == null) return;
    setSaving(true);
    setFormError(null);
    const payload = {
      tournamentId,
      homeTeamId: Number(form.homeTeamId),
      awayTeamId: Number(form.awayTeamId),
      refereeId: Number(form.refereeId),
      matchDate: new Date(form.matchDate).toISOString(),
      venue: form.venue,
      matchday: Number(form.matchday),
    };
    try {
      if (editing) {
        await matchesApi.update(editing.id, payload);
      } else {
        await matchesApi.create(payload);
      }
      setModalOpen(false);
      loadMatches();
    } catch (err) {
      setFormError((err as ApiError).message ?? toApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: Match) => {
    if (!confirm('¿Eliminar este partido?')) return;
    try {
      await matchesApi.remove(m.id);
      loadMatches();
    } catch (err) {
      alert(toApiError(err).message);
    }
  };

  const handleStatusChange = async (m: Match, status: string) => {
    try {
      await matchesApi.updateStatus(m.id, status);
      loadMatches();
    } catch (err) {
      alert(toApiError(err).message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Partidos</h1>
          <p>Calendario de partidos por torneo</p>
        </div>
        {canManage && tournamentId != null && (
          <button className="btn" onClick={openCreate}>+ Nuevo partido</button>
        )}
      </div>

      <div className="toolbar">
        <select value={tournamentId ?? ''} onChange={(e) => setTournamentId(Number(e.target.value))}>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>{t.name} — {t.season}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading-state">Cargando…</div>
        ) : matches.length === 0 ? (
          <div className="empty-state">No hay partidos programados para este torneo.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Jornada</th><th>Fecha</th><th>Partido</th><th>Sede</th><th>Árbitro</th><th>Estado</th>
                {(canManage || canOperate) && <th></th>}
              </tr>
            </thead>
            <tbody>
              {matches.map((m) => (
                <tr key={m.id}>
                  <td>{m.matchday}</td>
                  <td>{new Date(m.matchDate).toLocaleString()}</td>
                  <td>{m.homeTeamName} vs {m.awayTeamName}</td>
                  <td>{m.venue}</td>
                  <td>{m.refereeFullName}</td>
                  <td>
                    {canOperate ? (
                      <select value={m.status} onChange={(e) => handleStatusChange(m, e.target.value)}>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge">{statusLabel[m.status]}</span>
                    )}
                  </td>
                  {canManage && (
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>Eliminar</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar' : 'Nuevo'} partido</h2>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="alert alert-error">{formError}</div>}
              <div className="form-grid">
                <div className="field">
                  <label>Equipo local</label>
                  <select required value={form.homeTeamId} onChange={(e) => setForm((f) => ({ ...f, homeTeamId: e.target.value }))}>
                    <option value="" disabled>Selecciona…</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Equipo visitante</label>
                  <select required value={form.awayTeamId} onChange={(e) => setForm((f) => ({ ...f, awayTeamId: e.target.value }))}>
                    <option value="" disabled>Selecciona…</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Árbitro</label>
                  <select required value={form.refereeId} onChange={(e) => setForm((f) => ({ ...f, refereeId: e.target.value }))}>
                    <option value="" disabled>Selecciona…</option>
                    {referees.map((r) => <option key={r.id} value={r.id}>{r.firstName} {r.lastName}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Fecha y hora</label>
                  <input type="datetime-local" required value={form.matchDate} onChange={(e) => setForm((f) => ({ ...f, matchDate: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Sede</label>
                  <input required value={form.venue} onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Jornada</label>
                  <input type="number" min={1} required value={form.matchday} onChange={(e) => setForm((f) => ({ ...f, matchday: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
