import axios, { AxiosInstance } from 'axios';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { MatchDto } from './riot.dto';

export interface RiotAccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export class RiotService {
  private readonly apiKey: string;
  private readonly axios: AxiosInstance;

  constructor() {
    this.apiKey = env.RIOT_API_KEY;
    this.axios  = axios.create({
      baseURL: env.RIOT_BASE_URL,
      timeout: 5000,
      params: { api_key: this.apiKey },
    });
  }

  public async getAccountByRiotId(
    gameName: string,
    tagLine: string
  ): Promise<RiotAccountResponse> {
    try {
      const { data } = await this.axios.get<RiotAccountResponse>(
        `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );
      return data;
    } catch (err) {
      logger.error('RiotService.getAccountByRiotId error: %o', err);
      throw new Error('Failed to fetch Riot account');
    }
  }

  public async getMatchById(matchId: string): Promise<MatchDto> {
    try {
      const { data } = await this.axios.get<MatchDto>(
        `/lol/match/v5/matches/${matchId}`
      );
      return data;
    } catch (err) {
      logger.error('RiotService.getMatchById error: %o', err);
      throw new Error('Failed to fetch match data');
    }
  }
}
