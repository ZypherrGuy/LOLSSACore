import axios from 'axios';
import { logger } from '../utils/logger';

export interface ChampionData {
  id: string;
  key: string; 
  name: string;
  title: string;
}

export interface ChampionDictionary {
  [championName: string]: ChampionData;
}

export class DataDragonService {
  private championCache: ChampionDictionary | null = null;
  private latestVersion: string | null = null;

  public async getChampionData(): Promise<ChampionDictionary> {
    if (this.championCache) {
      return this.championCache;
    }
    try {

      const versionsResponse = await axios.get<string[]>(
        'https://ddragon.leagueoflegends.com/api/versions.json'
      );
      const versions = versionsResponse.data;
      if (!versions || versions.length === 0) {
        throw new Error('No versions found from DataDragon.');
      }
      this.latestVersion = versions[0];

      const championResponse = await axios.get(
        `https://ddragon.leagueoflegends.com/cdn/${this.latestVersion}/data/en_US/champion.json`
      );
      const championData = championResponse.data;
      if (!championData || !championData.data) {
        throw new Error('Invalid champion data from DataDragon.');
      }
      this.championCache = championData.data as ChampionDictionary;
      return this.championCache;
    } catch (error) {
      logger.error('Error fetching champion data: %o', error);
      throw new Error('Failed to fetch champion data.');
    }
  }

  public async getAllChampions(): Promise<ChampionDictionary> {
    return this.getChampionData();
  }

  /**
   * Returns champion info for the given key.
   * @param key Champion key (can be a string or number)
   */
  public async getChampionByKey(key: string | number): Promise<ChampionData | null> {
    const champions = await this.getChampionData();
    const keyStr = key.toString();
    for (const championName in champions) {
      if (champions.hasOwnProperty(championName)) {
        const champion = champions[championName];
        if (champion.key === keyStr) {
          return champion;
        }
      }
    }
    return null;
  }
}
