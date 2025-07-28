import { SessionService } from './session.service';
import { logger } from '../../utils/logger';
import { SessionDTO } from './session.dto';

const sessionService = new SessionService();

export const sessionResolvers = {
  Query: {
    activeSessions: async (): Promise<SessionDTO[]> => {
      try {
        return await sessionService.getActiveSessions();
      } catch (error) {
        logger.error('Error fetching active sessions:', error);
        throw new Error('Failed to fetch active sessions');
      }
    }
  }
};