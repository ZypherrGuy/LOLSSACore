export interface PlayerStatsDTO {
  playerId: string;
  stats: Record<string, number>;
}

export interface TeamStatsDTO {
  teamId: string;
  stats: Record<string, number>;
}

export interface AwardTypeDTO {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface PlayerWeeklyAwardDTO {
  awardTypeId: string;
  playerId: string;
}

export interface TeamWeeklyAwardDTO {
  awardTypeId: string;
  teamId: string;
}
