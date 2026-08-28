import { useEffect, useState } from 'react';
import { usersApi } from '../api/endpoints';
import { toApiError } from '../api/client';
import type { UserAccount } from '../api/types';

const roles = ['Admin', 'Manager', 'Referee', 'Viewer'];

export function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    usersApi
      .getAll()
      .then(setUsers)
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeRole = async (user: UserAccount, role: string) => {
    try {
      await usersApi.updateRole(user.id, role);
      load();
    } catch (err) {
      alert(toApiError(err).message);
    }
  };

  const toggleStatus = async (user: UserAccount) => {
    try {
      await usersApi.updateStatus(user.id, !user.isActive);
      load();
    } catch (err) {
      alert(toApiError(err).message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Cuentas registradas y sus roles (solo Admin)</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading-state">Cargando…</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No hay usuarios registrados.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.roles[0] ?? ''} onChange={(e) => changeRole(u, e.target.value)}>
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? '' : 'danger'}`}>
                      {u.isActive ? 'Activo' : 'Desactivado'}
                    </span>
                  </td>
                  <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
