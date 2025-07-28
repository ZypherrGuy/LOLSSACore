import { TeamService } from '../../../services/TeamService';
import { logger } from '../../../utils/logger';

const teamService = new TeamService();

export const teamResolvers = {
  Query: {
    Teams: async (_: any, __: any) => {
      try {
        const teams = await teamService.getTeams();
        return teams;
      } catch (error) {
        logger.error('Error fetching teams: %o', error);
        throw new Error('Failed to fetch teams');
      }
    },
    Team: async (_: any, args: { id: string }) => {
      try {
        const team = await teamService.getTeam(args.id);
        return team || null;
      } catch (error) {
        logger.error('Error fetching team: %o', error);
        throw new Error('Failed to fetch team');
      }
    },
  },
};
