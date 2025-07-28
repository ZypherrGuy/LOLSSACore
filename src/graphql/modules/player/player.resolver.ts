import { PlayerService } from '../../../services/PlayerService';
import { SessionRepository } from '../../../repositories/SessionRepository';
import { logger } from '../../../utils/logger';

const playerService = new PlayerService();
const sessionRepo = new SessionRepository();

export const playerResolvers = {
  Query: {
    Players: async (_: any, __: any) => {
      try {
        const players = await playerService.getPlayers();
        return players;
      } catch (error) {
        logger.error('Error fetching players: %o', error);
        throw new Error('Failed to fetch players');
      }
    },
    Player: async (_: any, args: { id: string }) => {
      try {
        const player = await playerService.getPlayer(args.id);
        return player || null;
      } catch (error) {
        logger.error('Error fetching player: %o', error);
        throw new Error('Failed to fetch player');
      }
    },
  },
  Mutation: {
    registerPlayer: async (_: any, args: any) => {
      try {
        const newPlayer = await playerService.registerPlayer(args);
        // Omit the password before returning to the client
        delete newPlayer.password;
        return newPlayer;
      } catch (error) {
        logger.error('Error registering player: %o', error);
        throw new Error('Failed to register player');
      }
    },
    loginPlayer: async (_: any, args: { email: string; password: string }) => {
      try {
        const { token, player } = await playerService.loginPlayer(args.email, args.password);
        delete player.password;
        return { token, player };
      } catch (error) {
        logger.error('Error logging in: %o', error);
        throw new Error('Failed to login');
      }
    },
    logoutPlayer: async (_: any, __: any, context: any) => {
      const token = context.token;
      if (!token) {
        throw new Error('Not authenticated');
      }
      try {
        const deletedSession = await sessionRepo.deleteSession(token);
        return !!deletedSession;
      } catch (error) {
        logger.error('Error during logout: %o', error);
        throw new Error('Logout failed');
      }
    },
  },
  Player: {
    contactDetails: (parent: any) => ({
      email: parent.email,
      phoneNumber: parent.phoneNumber,
    }),
    address: (parent: any) => ({
      unit: parent.unit,
      complex: parent.complex,
      streetNumber: parent.streetNumber,
      streetName: parent.streetName,
      city: parent.city,
      province: parent.province,
      zipCode: parent.zipCode,
      country: parent.country,
    }),
  },
};
