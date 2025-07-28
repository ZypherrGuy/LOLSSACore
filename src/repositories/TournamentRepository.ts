import pool from '../config/postgres';

export interface ITournamentRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export class TournamentRepository implements ITournamentRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Tournaments"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Tournaments" WHERE id = $1', [id]);
    return result.rows[0];
  }
}
