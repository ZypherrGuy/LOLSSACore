import pool from '../config/postgres';

export interface IDivisionRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export class DivisionRepository implements IDivisionRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Divisions"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Divisions" WHERE id = $1', [id]);
    return result.rows[0];
  }
}
