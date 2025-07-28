import { MatchService } from './match.service';
import { logger }       from '../../../utils/logger';
import { MatchSummaryDTO } from './match.dto';

const matchService = new MatchService();

export const matchResolvers = {
  Query: {
    matches: async (): Promise<MatchSummaryDTO[]> => {
      try {
        return await matchService.getMatches();
      } catch (error) {
        logger.error('Error fetching matches from Strapi:', error);
        throw new Error('Failed to fetch matches');
      }
    },
  },
};
