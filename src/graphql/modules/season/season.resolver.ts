import { SeasonService } from '../../../services/SeasonService';
import { logger } from '../../../utils/logger';

const seasonService = new SeasonService();

export const seasonResolvers = {
  Query: {
    Seasons: async (_: any, __: any) => {
      try {
        const seasons = await seasonService.getSeasons();
        return seasons;
      } catch (error) {
        logger.error('Error fetching seasons: %o', error);
        throw new Error('Failed to fetch seasons');
      }
    },
    Season: async (_: any, args: { id: string }) => {
      try {
        const season = await seasonService.getSeason(args.id);
        return season || null;
      } catch (error) {
        logger.error('Error fetching season: %o', error);
        throw new Error('Failed to fetch season');
      }
    },
  },
};
