import { DataDragonService } from './datadragon.service';
import { logger } from '../../utils/logger';

const dataDragonService = new DataDragonService();

export const dataDragonResolvers = {
  Query: {
    champions: async (): Promise<any[]> => {
      try {
        return await dataDragonService.getAllChampions();
      } catch (err) {
        logger.error('Error in champions resolver: %o', err);
        throw new Error('Failed to fetch champions');
      }
    },

    championByKey: async (
      _: unknown,
      args: { key: string }
    ): Promise<any | null> => {
      try {
        const champ = await dataDragonService.getChampionByKey(args.key);
        if (!champ) throw new Error('Champion not found');
        return champ;
      } catch (err) {
        logger.error('Error in championByKey resolver: %o', err);
        throw new Error('Failed to fetch champion by key');
      }
    },
  },
};
