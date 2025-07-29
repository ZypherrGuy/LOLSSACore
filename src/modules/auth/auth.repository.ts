import { pool } from '../../config/database';
import { PlayerWithPasswordDTO } from '../player/player.dto';
import { PlayerRepository } from '../player/player.repository';
import { SessionRepository } from '../session/session.repository';
import { UserDTO } from '../user/user.dto';

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

  createUser(
    id: string,
    username: string,
    email: string,
    passwordHash: string
  ): Promise<UserDTO>;
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

  async createUser(
    id: string,
    username: string,
    email: string,
    passwordHash: string
  ) {
    const result = await pool.query(
      `INSERT INTO users
         (id, username, email, password_hash, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(),NOW())
       RETURNING id, username, email, contact_number AS "contactNumber",
                 is_email_verified AS "isEmailVerified"`,
      [id, username, email, passwordHash]
    );
    return result.rows[0] as UserDTO;
  }
}
