// Tipos que reflejan los DTOs del backend (SportsLeague.API/DTOs).
// Mantenerlos sincronizados manualmente si cambian los DTOs en el backend.

export type Role = 'Admin' | 'Manager' | 'Referee' | 'Viewer';

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  roles: Role[];
  token: string;
  expiresAtUtc: string;
}

export interface UserAccount {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  roles: Role[];
}

export interface Team {
  id: number;
  name: string;
  city: string;
  stadium: string;
  logoUrl?: string | null;
  foundedDate: string;
  createdAt?: string;
  updatedAt?: string | null;
}

export type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  number: number;
  position: PlayerPosition;
  teamId: number;
  teamName?: string;
}

export interface Referee {
  id: number;
  firstName: string;
  lastName: string;
  nationality: string;
}

export type SponsorCategory = 'Main' | 'Gold' | 'Silver' | 'Bronze';

export interface Sponsor {
  id: number;
  name: string;
  contactEmail: string;
  phone?: string | null;
  websiteUrl?: string | null;
  category: SponsorCategory;
}

export type TournamentStatus = 'Pending' | 'InProgress' | 'Finished';

export interface Tournament {
  id: number;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
}

export type MatchStatus = 'Scheduled' | 'InProgress' | 'Finished' | 'Suspended';

export interface Match {
  id: number;
  tournamentId: number;
  tournamentName: string;
  homeTeamId: number;
  homeTeamName: string;
  awayTeamId: number;
  awayTeamName: string;
  refereeId: number;
  refereeFullName: string;
  matchDate: string;
  venue: string;
  matchday: number;
  status: MatchStatus;
}

export interface Standing {
  position: number;
  teamId: number;
  teamName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TopScorer {
  playerId: number;
  playerName: string;
  teamName: string;
  goals: number;
  penalties: number;
  matchesWithGoals: number;
}

export interface CardStat {
  playerId: number;
  playerName: string;
  teamName: string;
  yellowCards: number;
  redCards: number;
  totalCards: number;
}

export interface DashboardSummary {
  totalTeams: number;
  totalPlayers: number;
  totalTournaments: number;
  activeTournaments: number;
  totalMatches: number;
  totalReferees: number;
  totalSponsors: number;
  upcomingMatches: Match[];
}
