import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { Role } from '../api/types';

interface Props {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return <div className="loading-state">Cargando…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return (
      <div className="content">
        <div className="alert alert-error">No tienes permisos para ver esta sección.</div>
      </div>
    );
  }

  return <>{children}</>;
}
