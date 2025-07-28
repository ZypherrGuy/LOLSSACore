import { TournamentService } from '../../../services/TournamentService';
import { logger } from '../../../utils/logger';

const tournamentService = new TournamentService();

export const tournamentResolvers = {
  Query: {
    Tournaments: async (_: any, __: any) => {
      try {
        const tournaments = await tournamentService.getTournaments();
        return tournaments;
      } catch (error) {
        logger.error('Error fetching tournaments: %o', error);
        throw new Error('Failed to fetch tournaments');
      }
    },
    Tournament: async (_: any, args: { id: string }) => {
      try {
        const tournament = await tournamentService.getTournament(args.id);
        return tournament || null;
      } catch (error) {
        logger.error('Error fetching tournament: %o', error);
        throw new Error('Failed to fetch tournament');
      }
    },
  },
};
