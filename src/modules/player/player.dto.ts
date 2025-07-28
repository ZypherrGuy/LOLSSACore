export interface LinkedAccountDTO {
  id: string;
  platform: string;
  accountIdentifier: string;
  metadata: any;
  verified: boolean;
  linkedAt: Date;
}

export interface RiotAccountDTO {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  verified: boolean;
  linkedAt: Date;
}

export interface PlayerDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: Date;
  city?: string;
  countryCode?: string;
  profilePictureUrl?: string;
  playerRating: number;
  currentTeamId?: string;
  linkedAccounts?: LinkedAccountDTO[];
  riotAccount?: RiotAccountDTO;
  createdAt: Date;
  updatedAt: Date;
}
