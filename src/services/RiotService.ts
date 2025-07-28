// src/services/RiotService.ts
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { MatchDto } from '../graphql/external/riot/dto/RiotMatchDTO';

dotenv.config(); // Load env variables

// Define the expected shape of Riot's response.
export interface RiotAccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export class RiotService {
  private readonly apiKey: string;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.apiKey = process.env.RIOT_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('RIOT_API_KEY is not defined in environment variables.');
    }

    this.axiosInstance = axios.create({
      baseURL: process.env.RIOT_BASE_URL || 'https://europe.api.riotgames.com',
      timeout: 5000, 
    });
  }

  public async getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccountResponse> {
    try {
      const response = await this.axiosInstance.get<RiotAccountResponse>(
        `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
        { params: { api_key: this.apiKey } }
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching Riot account for %s#%s: %o', gameName, tagLine, error);
      throw new Error('Failed to fetch Riot account.');
    }
  }
  
  public async getMatchById(matchId: string): Promise<MatchDto> {
    try {
      const response = await this.axiosInstance.get<MatchDto>(
        `/lol/match/v5/matches/${matchId}`,
        { params: { api_key: this.apiKey } }
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching match data for matchId %s: %o', matchId, error);
      throw new Error('Failed to fetch match data.');
    }
  }
}
