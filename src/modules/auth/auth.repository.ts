import { PlayerWithPasswordDTO } from '../player/player.dto';
import { PlayerRepository } from '../player/player.repository';
import { SessionRepository } from '../session/session.repository';

export interface IAuthRepository {
  getPlayerByEmail(email: string): Promise<PlayerWithPasswordDTO | null>;

  createSession(
    playerId: string,
    token: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string
  ): Promise<any>;

  deleteSession(token: string): Promise<any>;
}

export class AuthRepository implements IAuthRepository {
  private playerRepo = new PlayerRepository();
  private sessionRepo = new SessionRepository();

  async getPlayerByEmail(email: string): Promise<PlayerWithPasswordDTO | null> {
    return this.playerRepo.getByEmail(email);
  }

  async createSession(
    playerId: string,
    token: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string
  ) {
    return this.sessionRepo.createSession({ playerId, token, expiresAt, userAgent, ipAddress });
  }

  async deleteSession(token: string) {
    return this.sessionRepo.deleteSessionByToken(token);
  }
}
