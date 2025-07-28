import { DataDragonService } from '../../../services/DataDragonService';
import { logger } from '../../../utils/logger';

const dataDragonService = new DataDragonService();

export const dataDragonResolvers = {
  Query: {
    champions: async () => {
      try {
        const championData = await dataDragonService.getAllChampions();
        return Object.values(championData);
      } catch (error) {
        logger.error('Error fetching champions: %o', error);
        throw new Error('Failed to fetch champions.');
      }
    },
    championByKey: async (_: any, args: { key: string }) => {
      try {
        const champion = await dataDragonService.getChampionByKey(args.key);
        if (!champion) {
          throw new Error('Champion not found.');
        }
        return champion;
      } catch (error) {
        logger.error('Error fetching champion by key: %o', error);
        throw new Error('Failed to fetch champion by key.');
      }
    },
  },
};
