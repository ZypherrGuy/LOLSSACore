import { PlayerService } from '../../../services/PlayerService';
import { RiotService } from '../../../services/RiotService';
import { logger } from '../../../utils/logger';

const playerService = new PlayerService();
const riotService = new RiotService();

export const riotResolvers = {
  Query: {
    RiotAccount: async (_: any, args: { gameName: string; tagLine: string }) => {
      try {
        const riotAccount = await playerService.fetchRiotAccount(args.gameName, args.tagLine);
        return riotAccount;
      } catch (error) {
        logger.error('Error fetching Riot account: %o', error);
        throw new Error('Failed to fetch Riot account.');
      }
    },
    match: async (_: any, args: { matchId: string }) => {
      try {
        const matchData = await riotService.getMatchById(args.matchId);
        return matchData;
      } catch (error) {
        logger.error('Error fetching match data: %o', error);
        throw new Error('Failed to fetch match data.');
      }
    },
  },
};
