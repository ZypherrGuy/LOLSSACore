export interface TeamSocialAccountDTO {
  id: string;
  platform: string;
  accountUrl: string;
}

import { PlayerDTO } from '../player/player.dto';

export interface TeamDTO {
  id: string;
  name: string;
  tag: string;
  logoUrl?: string;
  bio?: string;
  genderType: 'Female' | 'Mixed';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  players?: PlayerDTO[];  
  socialAccounts: TeamSocialAccountDTO[];
}