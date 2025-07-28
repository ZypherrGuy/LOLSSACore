import { RiotService } from './riot.service';
import { logger } from '../../utils/logger';

const riotService = new RiotService();

export const riotResolvers = {
  Query: {
    RiotAccount: async (
      _: unknown,
      { gameName, tagLine }: { gameName: string; tagLine: string }
    ) => {
      try {
        return await riotService.getAccountByRiotId(gameName, tagLine);
      } catch (err) {
        logger.error('Error in RiotAccount resolver:', err);
        throw new Error('Failed to fetch Riot account');
      }
    },

    match: async (_: unknown, { matchId }: { matchId: string }) => {
      try {
        return await riotService.getMatchById(matchId);
      } catch (err) {
        logger.error('Error in match resolver:', err);
        throw new Error('Failed to fetch match data');
      }
    },
  },
};
