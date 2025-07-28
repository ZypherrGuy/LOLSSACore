export enum TournamentStatusEnum {
  Open = 'Open',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export const TOURNAMENT_STATUSES = ['Open', 'In Progress', 'Completed'] as const;
export type TournamentStatus = typeof TOURNAMENT_STATUSES[number];