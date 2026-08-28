import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/endpoints';
import { getStoredToken, setStoredToken, toApiError } from '../api/client';
import type { Role } from '../api/types';

interface CurrentUser {
  id: number;
  email: string;
  fullName: string;
  roles: Role[];
}

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, requestedRole?: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser({ id: me.id, email: me.email, fullName: me.fullName, roles: me.roles });
    } catch {
      // Token vencido o inválido: se limpia para forzar un nuevo login.
      setStoredToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await authApi.login(email, password);
      setStoredToken(result.token);
      setUser({ id: result.userId, email: result.email, fullName: result.fullName, roles: result.roles });
    } catch (err) {
      throw toApiError(err);
    }
  }, []);

  const register = useCallback(
    async (fullName: string, email: string, password: string, requestedRole?: string) => {
      try {
        const result = await authApi.register(fullName, email, password, requestedRole);
        setStoredToken(result.token);
        setUser({ id: result.userId, email: result.email, fullName: result.fullName, roles: result.roles });
      } catch (err) {
        throw toApiError(err);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => !!user && roles.some((r) => user.roles.includes(r)),
    [user],
  );

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, hasRole }),
    [user, isLoading, login, register, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}
