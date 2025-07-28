import { ISessionRepository, SessionRepository } from './session.repository';
import { SessionDTO } from './session.dto';

export class SessionService {
  constructor(private sessionRepo: ISessionRepository = new SessionRepository()) {}

  async createSession(playerId: string, token: string, expiresAt: Date, userAgent?: string, ipAddress?: string): Promise<SessionDTO> {
    return this.sessionRepo.createSession({ playerId, token, expiresAt, userAgent, ipAddress });
  }

  async getActiveSessions(): Promise<SessionDTO[]> {
    return this.sessionRepo.getActiveSessions();
  }

  async revokeSession(token: string): Promise<boolean> {
    return this.sessionRepo.deleteSessionByToken(token);
  }
}