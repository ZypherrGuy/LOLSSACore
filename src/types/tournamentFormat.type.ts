export enum TournamentFormatEnum {
  OneVOne = '1v1',
  FiveVFive = '5v5',
  FreeForAll = 'Free-For-All',
}

export const TOURNAMENT_FORMATS = ['1v1', '5v5', 'Free-For-All'] as const;
export type TournamentFormat = typeof TOURNAMENT_FORMATS[number];