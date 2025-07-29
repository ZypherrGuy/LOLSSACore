import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { app }   from '../setup';
import { pool }  from '../../src/config/database';

describe('Password reset flow', () => {
  let csrfToken: string;
  let csrfCookie: string;
  const email = 'test-reset@example.com';
  const password = 'initial123';
  let userId: string;
  let playerId: string;

  beforeAll(async () => {
    // 1) seed a verified user
    userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users
         (id, email, password_hash, username, is_email_verified, created_at, updated_at)
       VALUES ($1,$2,$3,$4, TRUE, now(), now())`,
      [userId, email, passwordHash, `user_${userId}`]
    );

    // 2) seed a player row for that user
    playerId = uuidv4();
    await pool.query(
      `INSERT INTO players
         (id, user_id, first_name, last_name, gender, date_of_birth, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6, now(), now())`,
      [playerId, userId, 'Test', 'User', 'Other', new Date('2000-01-01')]
    );
  });

  afterAll(async () => {
    // delete sessions, tokens, player, then user
    await pool.query(
      `DELETE FROM sessions WHERE player_id = $1`, [playerId]
    );
    await pool.query(
      `DELETE FROM password_reset_tokens WHERE user_id = $1`, [userId]
    );
    await pool.query(
      `DELETE FROM players WHERE id = $1`, [playerId]
    );
    await pool.query(
      `DELETE FROM users WHERE id = $1`, [userId]
    );
  });

  it('1) requestPasswordReset returns true', async () => {
    // get CSRF token
    const res0 = await request(app).get('/csrf-token').expect(200);
    csrfToken = res0.body.csrfToken;
    const rawSet = res0.headers['set-cookie'] as string|string[];
    csrfCookie = (Array.isArray(rawSet) ? rawSet : [rawSet])
      .find(c => c.startsWith('__Host-XSRF-TOKEN='))!;

    // call requestPasswordReset
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .send({
        query: `mutation {
          requestPasswordReset(email: "${email}")
        }`
      })
      .expect(200);

    expect(res.body.data.requestPasswordReset).toBe(true);

    // verify token exists
    const { rows } = await pool.query(
      `SELECT token FROM password_reset_tokens WHERE user_id = $1`,
      [userId]
    );
    expect(rows.length).toBeGreaterThan(0);
  });

  it('2) resetPassword with valid token works', async () => {
    // fetch the reset token
    const { rows } = await pool.query(
      `SELECT token FROM password_reset_tokens WHERE user_id = $1`,
      [userId]
    );
    const token = rows[0].token;

    // call resetPassword
    const newPass = 'newSecret123';
    const res = await request(app)
      .post('/graphql')
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .send({
        query: `mutation {
          resetPassword(token: "${token}", newPassword: "${newPass}")
        }`
      })
      .expect(200);

    expect(res.body.data.resetPassword).toBe(true);

    // verify that we can now sign in with the new password
    const signInRes = await request(app)
      .post('/graphql')
      .set('Cookie', csrfCookie)
      .set('x-csrf-token', csrfToken)
      .send({
        query: `mutation {
          signIn(email: "${email}", password: "${newPass}") {
            token
          }
        }`
      })
      .expect(200);

    // should get a JWT back
    const jwt = signInRes.body.data.signIn.token;
    expect(typeof jwt).toBe('string');
    expect(jwt.length).toBeGreaterThan(0);
  });
});
