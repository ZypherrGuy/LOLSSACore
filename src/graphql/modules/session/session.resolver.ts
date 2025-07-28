import { SessionRepository } from '../../../repositories/SessionRepository';
import { logger } from '../../../utils/logger';

const sessionRepo = new SessionRepository();

export const sessionResolvers = {
  Query: {
    activeSessions: async () => {
      try {
        const sessions = await sessionRepo.getActiveSessions();
        return sessions;
      } catch (error) {
        logger.error('Error fetching active sessions: %o', error);
        throw new Error('Failed to fetch active sessions');
      }
    },
  },
};
