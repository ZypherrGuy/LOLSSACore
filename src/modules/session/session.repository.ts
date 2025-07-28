import { pool } from '../../config/database';
import { SessionDTO } from './session.dto';
import crypto from 'crypto';

export interface ISessionRepository {
  createSession(data: { playerId: string; token: string; expiresAt: Date; userAgent?: string; ipAddress?: string }): Promise<SessionDTO>;
  getActiveSessions(): Promise<SessionDTO[]>;
  deleteSessionByToken(token: string): Promise<boolean>;
}

export class SessionRepository implements ISessionRepository {
  private readonly table = 'sessions';

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async createSession({ playerId, token, expiresAt, userAgent, ipAddress }: { playerId: string; token: string; expiresAt: Date; userAgent?: string; ipAddress?: string }): Promise<SessionDTO> {
    const tokenHash = this.hashToken(token);
    const result = await pool.query(
      `INSERT INTO ${this.table} (player_id, token_hash, expires_at, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, player_id AS "playerId", created_at AS "createdAt", expires_at AS "expiresAt", user_agent AS "userAgent", ip_address AS "ipAddress"`,
      [playerId, tokenHash, expiresAt, userAgent || null, ipAddress || null]
    );
    return result.rows[0];
  }

  async getActiveSessions(): Promise<SessionDTO[]> {
    const result = await pool.query(
      `SELECT id, player_id AS "playerId", created_at AS "createdAt", expires_at AS "expiresAt", user_agent AS "userAgent", ip_address AS "ipAddress"
       FROM ${this.table} WHERE expires_at > NOW()`
    );
    return result.rows;
  }

  async deleteSessionByToken(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);
    const result = await pool.query(
      `DELETE FROM ${this.table} WHERE token_hash = $1`,
      [tokenHash]
    );
    return (result.rowCount ?? 0) > 0;
  }
}