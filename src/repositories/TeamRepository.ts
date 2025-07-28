import pool from '../config/postgres';

export interface ITeamRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export class TeamRepository implements ITeamRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Teams"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Teams" WHERE id = $1', [id]);
    return result.rows[0];
  }
}
