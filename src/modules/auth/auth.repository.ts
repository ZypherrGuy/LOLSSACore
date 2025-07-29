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

  saveVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findVerificationToken(token: string): Promise<{ user_id: string; expires_at: Date } | null>;
  deleteVerificationToken(token: string): Promise<void>;
  isEmailVerified(userId: string): Promise<boolean>;

  savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findPasswordResetToken(token: string): Promise<{ user_id: string; expires_at: Date } | null>;
  deletePasswordResetToken(token: string): Promise<void>;
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

  async saveVerificationToken(userId: string, token: string, expiresAt: Date) {
    await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token, expires_at)
       VALUES ($1,$2,$3)`,
      [userId, token, expiresAt]
    );
  }

  async findVerificationToken(token: string) {
    const { rows } = await pool.query(
      `SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1`,
      [token]
    );
    return rows[0] || null;
  }

  async deleteVerificationToken(token: string) {
    await pool.query(
      `DELETE FROM email_verification_tokens WHERE token = $1`,
      [token]
    );
  }

  async isEmailVerified(userId: string): Promise<boolean> {
    const { rows } = await pool.query(
      `SELECT is_email_verified FROM users WHERE id = $1`,
      [userId]
    );
    return rows[0]?.is_email_verified === true;
  }

  async savePasswordResetToken(userId: string, token: string, expiresAt: Date) {
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  }

  async findPasswordResetToken(token: string) {
    const { rows } = await pool.query(
      `SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1`,
      [token]
    );
    return rows[0] || null;
  }

  async deletePasswordResetToken(token: string) {
    await pool.query(
      `DELETE FROM password_reset_tokens WHERE token = $1`,
      [token]
    );
  }
}
