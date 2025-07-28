import pool from '../config/postgres';

export interface ISessionRepository {
  createSession(session: { playerId: number; token: string; expiresAt: Date }): Promise<any>;
  getActiveSessions(): Promise<any[]>;
}

export class SessionRepository implements ISessionRepository {
  async createSession(session: { playerId: number; token: string; expiresAt: Date }): Promise<any> {
    const { playerId, token, expiresAt } = session;
    const result = await pool.query(
      `INSERT INTO "Sessions" (playerid, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [playerId, token, expiresAt]
    );
    return result.rows[0];
  }
  
  async getActiveSessions(): Promise<any[]> {
    const result = await pool.query(
      `SELECT * FROM "Sessions" WHERE expires_at > NOW()`
    );
    return result.rows;
  }

  async deleteSession(token: string): Promise<any> {
    const result = await pool.query(
      `DELETE FROM "Sessions" WHERE token = $1 RETURNING *`,
      [token]
    );
    return result.rows[0]; 
  }
}
