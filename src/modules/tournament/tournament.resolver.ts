import { TournamentService } from './tournament.service';
import { logger }            from '../../utils/logger';
import { TournamentDTO }     from './tournament.dto';

const service = new TournamentService();

export const tournamentResolvers = {
  Query: {
    tournaments: async (): Promise<TournamentDTO[]> => {
      try {
        return await service.getTournaments();
      } catch (error) {
        logger.error('Error fetching tournaments:', error);
        throw new Error('Failed to fetch tournaments');
      }
    },
    tournament: async (_: unknown, { id }: { id: string }): Promise<TournamentDTO | null> => {
      try {
        return await service.getTournament(id);
      } catch (error) {
        logger.error('Error fetching tournament:', error);
        throw new Error('Failed to fetch tournament');
      }
    },
  },

  Tournament: {
    placements: (parent: TournamentDTO) => parent.placements,
    matches: (parent: TournamentDTO) => parent.matches,
  },

  TournamentEntry: {
    __resolveType(obj: any) {
      if ('firstName' in obj) return 'Player';
      if ('name' in obj) return 'Team';
      return null;
    }
  }
};