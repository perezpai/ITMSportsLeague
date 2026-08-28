import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout, hasRole } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="dot" />
          SportsLeague
        </div>
        <nav>
          <NavLink to="/" end className={navClass}>Inicio</NavLink>
          <NavLink to="/standings" className={navClass}>Tabla de posiciones</NavLink>
          <NavLink to="/matches" className={navClass}>Partidos</NavLink>

          <div className="nav-section">Gestión</div>
          <NavLink to="/teams" className={navClass}>Equipos</NavLink>
          <NavLink to="/players" className={navClass}>Jugadores</NavLink>
          <NavLink to="/tournaments" className={navClass}>Torneos</NavLink>
          <NavLink to="/referees" className={navClass}>Árbitros</NavLink>
          <NavLink to="/sponsors" className={navClass}>Patrocinadores</NavLink>

          {hasRole('Admin') && (
            <>
              <div className="nav-section">Administración</div>
              <NavLink to="/users" className={navClass}>Usuarios</NavLink>
            </>
          )}
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div />
          <div className="user-info">
            <span>{user?.fullName}</span>
            {user?.roles.map((r) => (
              <span key={r} className="role-badge">{r}</span>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={logout}>Salir</button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
