import axios from 'axios';
import { logger } from '../../utils/logger';

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  image: ChampionImage;
}

export interface ChampionDictionary {
  [championName: string]: ChampionData;
}

export class DataDragonService {
  private championCache: ChampionDictionary | null = null;
  private latestVersion: string | null = null;

  private async fetchChampionData(): Promise<ChampionDictionary> {
    if (this.championCache) return this.championCache;

    try {
      // 1) Get available versions
      const versionsResp = await axios.get<string[]>(
        'https://ddragon.leagueoflegends.com/api/versions.json'
      );
      const versions = versionsResp.data;
      if (!versions?.length) {
        throw new Error('No DataDragon versions found');
      }
      this.latestVersion = versions[0];

      // 2) Fetch champion list for that version
      const champResp = await axios.get<{
        data: Record<string, any>;
      }>(
        `https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/data/en_US/champion.json`
      );
      const raw = champResp.data?.data;
      if (!raw) {
        throw new Error('Invalid champion data from DataDragon');
      }

      // 3) Cache & return
      this.championCache = raw as ChampionDictionary;
      return this.championCache;
    } catch (err) {
      logger.error('DataDragonService.fetchChampionData error: %o', err);
      throw new Error('Failed to fetch champion data from DataDragon');
    }
  }

  public async getAllChampions(): Promise<ChampionData[]> {
    const dict = await this.fetchChampionData();
    return Object.values(dict);
  }

  public async getChampionByKey(key: string | number): Promise<ChampionData | null> {
    const dict = await this.fetchChampionData();
    const keyStr = key.toString();
    return Object.values(dict).find((c) => c.key === keyStr) || null;
  }
}
