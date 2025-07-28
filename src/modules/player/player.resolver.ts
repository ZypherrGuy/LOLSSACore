import { PlayerService } from './player.service';
import { UserService }   from '../user/user.service';
import { logger }        from '../../utils/logger';
import { PlayerDTO }     from './player.dto';

const playerService = new PlayerService();
const userService   = new UserService();

export const playerResolvers = {
  Query: {
    players: async (): Promise<PlayerDTO[]> => {
      try {
        return await playerService.getPlayers();
      } catch (error) {
        logger.error('Error fetching players:', error);
        throw new Error('Failed to fetch players');
      }
    },
    player: async (_: unknown, { id }: { id: string }): Promise<PlayerDTO | null> => {
      try {
        return (await playerService.getPlayer(id)) || null;
      } catch (error) {
        logger.error('Error fetching player:', error);
        throw new Error('Failed to fetch player');
      }
    }
  },

  Player: {
    user: async (parent: PlayerDTO) => {
      return await userService.getUser(parent.userId);
    },
    linkedAccounts: async (parent: PlayerDTO) => {
      return await playerService.getLinkedAccounts(parent.id);
    },
    riotAccount: async (parent: PlayerDTO) => {
      return await playerService.getRiotAccount(parent.userId);
    }
  }
};