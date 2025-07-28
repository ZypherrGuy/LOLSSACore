import pool from '../config/postgres';

export interface IPlayerRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
  getByEmail(email: string): Promise<any>;
  create(player: any): Promise<any>;
}

export class PlayerRepository implements IPlayerRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Players"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Players" WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getByEmail(email: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Players" WHERE email = $1', [email]);
    return result.rows[0];
  }

  async create(player: any): Promise<any> {
    const { username, email, password, firstNames, lastName, ign, nationality, dateOfBirth } = player;
    const result = await pool.query(
      `INSERT INTO "Players" (username, email, password, "firstNames", "lastName", ign, "nationality", "dateOfBirth", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [username, email, password, firstNames, lastName, ign, nationality, dateOfBirth]
    );
    return result.rows[0];
  }
}
