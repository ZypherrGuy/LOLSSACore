import pool from '../config/postgres';

export interface IUserRepository {
  getAll(): Promise<any[]>;
  getById(id: string): Promise<any>;
}

export class UserRepository implements IUserRepository {
  async getAll(): Promise<any[]> {
    const result = await pool.query('SELECT * FROM "Users"');
    return result.rows;
  }

  async getById(id: string): Promise<any> {
    const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
    return result.rows[0];
  }
}
