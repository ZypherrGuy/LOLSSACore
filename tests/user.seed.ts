import { pool } from '../src/config/database';
import bcrypt     from 'bcrypt';
import { randomUUID } from 'crypto';

export const TEST_USER_ID = randomUUID();
export const TEST_USER = {
  id:          TEST_USER_ID,
  email:       `test-${TEST_USER_ID}@example.com`,
  password:    'hunter2',
  username:    `user_${TEST_USER_ID.slice(0,8)}`,
  firstName:   'Test',
  lastName:    'User',
  gender:      'Other' as const,
  dateOfBirth: '2000-01-01',
};

export async function seedTestUser() {
  const passwordHash = await bcrypt.hash(TEST_USER.password, 10);
  await pool.query(
    `INSERT INTO users (
       id, email, password_hash, username, created_at, updated_at
     ) VALUES ($1,$2,$3,$4,NOW(),NOW())`,
    [TEST_USER.id, TEST_USER.email, passwordHash, TEST_USER.username]
  );
  await pool.query(
    `INSERT INTO players (
       id, user_id, first_name, last_name, gender, date_of_birth,
       created_at, updated_at
     ) VALUES (
       $1,$1,$2,$3,$4,$5,NOW(),NOW()
     )`,
    [
      TEST_USER.id,
      TEST_USER.firstName,
      TEST_USER.lastName,
      TEST_USER.gender,
      TEST_USER.dateOfBirth,
    ]
  );
  await pool.query(
    `UPDATE users SET is_email_verified = TRUE WHERE email = $1`,
    [TEST_USER.email]
  );
}

export async function cleanupTestUser() {
  await pool.query(`DELETE FROM players WHERE id = $1`, [TEST_USER.id]);
  await pool.query(`DELETE FROM users   WHERE id = $1`, [TEST_USER.id]);
}
