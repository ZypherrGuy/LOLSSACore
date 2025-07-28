export type TournamentStatus = 'Open' | 'In Progress' | 'Completed';
export type TournamentFormat = '1v1' | '5v5' | 'Free-For-All';

export interface PlacementDTO {
  firstEntryId: string;
  firstEntryType: 'Player' | 'Team';
  secondEntryId: string;
  secondEntryType: 'Player' | 'Team';
  thirdEntryId: string;
  thirdEntryType: 'Player' | 'Team';
}

export interface MatchSummaryDTO {
  id: string;
  matchId: string;
  scheduledAt: Date;
  completed: boolean;
}

export interface TournamentDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  prizePool?: number;
  organizerName?: string;
  organizerDiscordUrl?: string;
  organizerWebsiteUrl?: string;
  status: TournamentStatus;
  format: TournamentFormat;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  placements?: PlacementDTO | null;
  matches: MatchSummaryDTO[];
}