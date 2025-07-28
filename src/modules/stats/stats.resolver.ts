import { StatsService } from './stats.service';
import { logger }       from '../../utils/logger';

const statsService = new StatsService();

export const statsResolvers = {
  Query: {
    weeklyPlayerStats: async (_: any, { weekStart }: { weekStart: string }) => {
      try {
        return await statsService.weeklyPlayerStats(new Date(weekStart));
      } catch (err) {
        logger.error('Error fetching weekly player stats:', err);
        throw new Error('Failed to fetch weekly player stats');
      }
    },
    weeklyTeamStats: async (_: any, { weekStart }: { weekStart: string }) => {
      try {
        return await statsService.weeklyTeamStats(new Date(weekStart));
      } catch (err) {
        logger.error('Error fetching weekly team stats:', err);
        throw new Error('Failed to fetch weekly team stats');
      }
    },
    playerAwards: async (_: any, { weekStart }: { weekStart: string }) => {
      try {
        return await statsService.playerAwards(new Date(weekStart));
      } catch (err) {
        logger.error('Error fetching player awards:', err);
        throw new Error('Failed to fetch player awards');
      }
    },
    teamAwards: async (_: any, { weekStart }: { weekStart: string }) => {
      try {
        return await statsService.teamAwards(new Date(weekStart));
      } catch (err) {
        logger.error('Error fetching team awards:', err);
        throw new Error('Failed to fetch team awards');
      }
    }
  }
};
