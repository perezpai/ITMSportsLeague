import { apiClient } from './client';
import type {
  AuthUser,
  CardStat,
  DashboardSummary,
  Match,
  Player,
  Referee,
  Sponsor,
  Standing,
  Team,
  TopScorer,
  Tournament,
  UserAccount,
} from './types';

// ── Auth ──
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthUser>('/auth/login', { email, password }).then((r) => r.data),
  register: (fullName: string, email: string, password: string, requestedRole?: string) =>
    apiClient
      .post<AuthUser>('/auth/register', { fullName, email, password, requestedRole })
      .then((r) => r.data),
  me: () => apiClient.get<UserAccount>('/auth/me').then((r) => r.data),
};

// ── Users (admin) ──
export const usersApi = {
  getAll: () => apiClient.get<UserAccount[]>('/users').then((r) => r.data),
  updateRole: (id: number, role: string) => apiClient.put(`/users/${id}/role`, { role }),
  updateStatus: (id: number, isActive: boolean) => apiClient.put(`/users/${id}/status`, { isActive }),
};

// ── Dashboard ──
export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
};

// ── Teams ──
export const teamsApi = {
  getAll: () => apiClient.get<Team[]>('/team').then((r) => r.data),
  create: (data: Partial<Team>) => apiClient.post<Team>('/team', data).then((r) => r.data),
  update: (id: number, data: Partial<Team>) => apiClient.put(`/team/${id}`, data),
  remove: (id: number) => apiClient.delete(`/team/${id}`),
};

// ── Players ──
export const playersApi = {
  getAll: () => apiClient.get<Player[]>('/player').then((r) => r.data),
  create: (data: Partial<Player>) => apiClient.post<Player>('/player', data).then((r) => r.data),
  update: (id: number, data: Partial<Player>) => apiClient.put(`/player/${id}`, data),
  remove: (id: number) => apiClient.delete(`/player/${id}`),
};

// ── Referees ──
export const refereesApi = {
  getAll: () => apiClient.get<Referee[]>('/referee').then((r) => r.data),
  create: (data: Partial<Referee>) => apiClient.post<Referee>('/referee', data).then((r) => r.data),
  update: (id: number, data: Partial<Referee>) => apiClient.put(`/referee/${id}`, data),
  remove: (id: number) => apiClient.delete(`/referee/${id}`),
};

// ── Sponsors ──
export const sponsorsApi = {
  getAll: () => apiClient.get<Sponsor[]>('/sponsor').then((r) => r.data),
  create: (data: Partial<Sponsor>) => apiClient.post<Sponsor>('/sponsor', data).then((r) => r.data),
  update: (id: number, data: Partial<Sponsor>) => apiClient.put(`/sponsor/${id}`, data),
  remove: (id: number) => apiClient.delete(`/sponsor/${id}`),
};

// ── Tournaments ──
export const tournamentsApi = {
  getAll: () => apiClient.get<Tournament[]>('/tournament').then((r) => r.data),
  create: (data: Partial<Tournament>) => apiClient.post<Tournament>('/tournament', data).then((r) => r.data),
  update: (id: number, data: Partial<Tournament>) => apiClient.put(`/tournament/${id}`, data),
  remove: (id: number) => apiClient.delete(`/tournament/${id}`),
  updateStatus: (id: number, status: string) => apiClient.patch(`/tournament/${id}/status`, { status }),
  registerTeam: (id: number, teamId: number) => apiClient.post(`/tournament/${id}/teams`, { teamId }),
  getTeams: (id: number) => apiClient.get<Team[]>(`/tournament/${id}/teams`).then((r) => r.data),
};

// ── Matches ──
export const matchesApi = {
  getByTournament: (tournamentId: number) =>
    apiClient.get<Match[]>(`/match/tournament/${tournamentId}`).then((r) => r.data),
  create: (data: Partial<Match>) => apiClient.post<Match>('/match', data).then((r) => r.data),
  update: (id: number, data: Partial<Match>) => apiClient.put(`/match/${id}`, data),
  remove: (id: number) => apiClient.delete(`/match/${id}`),
  updateStatus: (id: number, status: string) => apiClient.patch(`/match/${id}/status`, { status }),
};

// ── Standings / stats ──
export const standingsApi = {
  getStandings: (tournamentId: number) =>
    apiClient.get<Standing[]>('/standings', { params: { tournamentId } }).then((r) => r.data),
  getTopScorers: (tournamentId: number) =>
    apiClient.get<TopScorer[]>('/stats/scorers', { params: { tournamentId } }).then((r) => r.data),
  getCardStats: (tournamentId: number) =>
    apiClient.get<CardStat[]>('/stats/cards', { params: { tournamentId } }).then((r) => r.data),
};
