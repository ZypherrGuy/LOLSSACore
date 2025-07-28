import { pool } from '../../config/database';
import { UserDTO } from './user.dto';

export interface IUserRepository {
  getAll(): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO | null>;
}

export class UserRepository implements IUserRepository {
  private readonly table = 'users';

  async getAll(): Promise<UserDTO[]> {
    const result = await pool.query(
      `SELECT id, username, email, contact_number AS "contactNumber", is_email_verified AS "isEmailVerified" FROM ${this.table}`
    );
    return result.rows;
  }

  async getById(id: string): Promise<UserDTO | null> {
    const result = await pool.query(
      `SELECT id, username, email, contact_number AS "contactNumber", is_email_verified AS "isEmailVerified" FROM ${this.table} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }
}