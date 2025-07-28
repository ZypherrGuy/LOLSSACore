import pool from '../config/postgres';

export interface ISeasonRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export class SeasonRepository implements ISeasonRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Seasons"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Seasons" WHERE id = $1', [id]);
    return result.rows[0];
  }
}
