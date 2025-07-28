import { TeamService } from './team.service';
import { PlayerService } from '../player/player.service';
import { logger }      from '../../utils/logger';
import { TeamDTO, TeamSocialAccountDTO }     from './team.dto';
import { PlayerDTO }   from '../player/player.dto';

const teamService = new TeamService();
const playerService = new PlayerService();

export const teamResolvers = {
  Query: {
    teams: async (): Promise<TeamDTO[]> => {
      try {
        return await teamService.getTeams();
      } catch (error) {
        logger.error('Error fetching teams:', error);
        throw new Error('Failed to fetch teams');
      }
    },
    team: async (_: unknown, { id }: { id: string }): Promise<TeamDTO | null> => {
      try {
        return (await teamService.getTeam(id)) || null;
      } catch (error) {
        logger.error('Error fetching team:', error);
        throw new Error('Failed to fetch team');
      }
    },
  },

  Team: {
    players: async (parent: TeamDTO): Promise<PlayerDTO[]> => {
      try {
        return await playerService.getPlayersByTeam(parent.id);
      } catch (error) {
        logger.error('Error resolving team.players:', error);
        throw new Error('Failed to fetch team players');
      }
    },
    socialAccounts: (parent: TeamDTO): TeamSocialAccountDTO[] => parent.socialAccounts
  }
};
