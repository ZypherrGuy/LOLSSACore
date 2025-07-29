import request from 'supertest';
import { app } from '../setup';
import { TEST_USER } from '../user.seed';
import { pool } from '../../src/config/database';

describe('CSRF & cookie auth flow', () => {
    let csrfToken: string;
    let csrfCookie: string;

    it('1) GET /csrf-token issues token + cookie', async () => {
    const res = await request(app)
        .get('/csrf-token')
        .expect(200)
        .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('csrfToken');
    csrfToken = res.body.csrfToken;

    const rawSet = res.headers['set-cookie'];
    expect(rawSet).toBeDefined();

    const set = Array.isArray(rawSet) ? rawSet : [rawSet];
    expect(set.some(cookie => cookie.startsWith('__Host-XSRF-TOKEN='))).toBe(true);
    csrfCookie = set.find(cookie => cookie.startsWith('__Host-XSRF-TOKEN='))!;
    });

    it('2) POST /graphql without CSRF header fails 403', async () => {
    await request(app)
        .post('/graphql')
        .set('Cookie', csrfCookie)
        .send({ query: '{ _empty }' })
        .expect(403);
    });

    it('3) POST /graphql without CSRF cookie fails 403', async () => {
    await request(app)
        .post('/graphql')
        .set('x-csrf-token', csrfToken)
        .send({ query: '{ _empty }' })
        .expect(403);
    });

    it('4) POST /graphql with both cookie + header succeeds', async () => {
    const res = await request(app)
        .post('/graphql')
        .set('Cookie', csrfCookie)
        .set('x-csrf-token', csrfToken)
        .send({ query: '{ _empty }' })
        .expect(200);

    expect(res.body).toHaveProperty('data._empty', null);
    });
    it('5) signIn mutation returns a valid token', async () => {
        const res = await request(app)
            .post('/graphql')
            .set('Cookie',       csrfCookie)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `
                mutation {
                signIn(email: "${TEST_USER.email}", password: "${TEST_USER.password}") {
                    token
                    player { id }
                }
                }
            `
            })
            .expect(200);

        const token = res.body.data?.signIn?.token;
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
    });
    it('6) register mutation returns token & cookie', async () => {
        const { body: { csrfToken }, headers: headers1 } = await request(app)
            .get('/csrf-token')
            .expect(200);

        const rawSet1 = headers1['set-cookie'] as string | string[];
        const setArr1 = Array.isArray(rawSet1) ? rawSet1 : [rawSet1];
        const csrfCookie = setArr1.find(c => c.startsWith('__Host-XSRF-TOKEN='));
        expect(csrfCookie).toBeDefined();

        const unique = Date.now();
        const res = await request(app)
            .post('/graphql')
            .set('Cookie', csrfCookie as string)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `
                mutation {
                register(
                    username:    "newuser${unique}",
                    email:       "new${unique}@example.com",
                    password:    "pass1234",
                    firstName:   "First${unique}",
                    lastName:    "Last${unique}",
                    gender:      "Other",
                    dateOfBirth: "2000-01-01",
                    countryCode: "US"
                ) {
                    token
                    player { id userId }
                }
                }
            `
            });

        if (res.body.errors) {
            console.error('GraphQL errors:', JSON.stringify(res.body.errors, null, 2));
        }

        expect(res.status).toBe(200);
        expect(res.body.errors).toBeUndefined();

        const token = res.body.data?.register?.token;
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token!.length).toBeGreaterThan(0);

        const rawSet2 = res.headers['set-cookie'] as string | string[];
        const setArr2 = Array.isArray(rawSet2) ? rawSet2 : [rawSet2];
        expect(
            setArr2.some(c => c.startsWith('jid=') && c.includes('HttpOnly'))
        ).toBe(true);
    });
    it('7) verifyEmail mutation confirms email', async () => {
        const { body: { csrfToken }, headers: headers1 } = await request(app)
            .get('/csrf-token')
            .expect(200);

        const rawSet1 = headers1['set-cookie'] as string | string[];
        const setArr1 = Array.isArray(rawSet1) ? rawSet1 : [rawSet1];
        const csrfCookie = setArr1.find(c => c.startsWith('__Host-XSRF-TOKEN='));
        expect(csrfCookie).toBeDefined();

        const unique = Date.now();
        const registerRes = await request(app)
            .post('/graphql')
            .set('Cookie', csrfCookie as string)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `
                mutation {
                register(
                    username:    "verify${unique}",
                    email:       "verify${unique}@example.com",
                    password:    "pass1234",
                    firstName:   "First",
                    lastName:    "Last",
                    gender:      "Other",
                    dateOfBirth: "2000-01-01",
                    countryCode: "US"
                ) {
                    token
                    player { id userId }
                }
                }
            `
            })
            .expect(200);

        const newUserId = registerRes.body.data?.register?.player?.userId;
        expect(newUserId).toBeDefined();

        const { rows } = await pool.query(
            `SELECT token FROM email_verification_tokens WHERE user_id = $1`,
            [newUserId]
        );
        expect(rows.length).toBeGreaterThan(0);
        const vToken = rows[0].token;

        const verifyRes = await request(app)
            .post('/graphql')
            .set('Cookie', csrfCookie as string)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `mutation { verifyEmail(token: "${vToken}") }`
            })
            .expect(200);

        expect(verifyRes.body.data.verifyEmail).toBe(true);

        const { rows: urows } = await pool.query(
            `SELECT is_email_verified FROM users WHERE id = $1`,
            [newUserId]
        );
        expect(urows[0].is_email_verified).toBe(true);
    });
    it('8) blocks signIn until email verified', async () => {
        const { body: { csrfToken }, headers: headers1 } = await request(app)
            .get('/csrf-token')
            .expect(200);
        const rawSet1 = headers1['set-cookie'] as string | string[];
        const setArr1 = Array.isArray(rawSet1) ? rawSet1 : [rawSet1];
        const csrfCookie = setArr1.find(c => c.startsWith('__Host-XSRF-TOKEN='));
        expect(csrfCookie).toBeDefined();

        const unique = Date.now();
        const testEmail    = `pending${unique}@example.com`;
        const testPassword = 'pass1234';
        await request(app)
            .post('/graphql')
            .set('Cookie', csrfCookie as string)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `
                mutation {
                register(
                    username:    "pending${unique}",
                    email:       "${testEmail}",
                    password:    "${testPassword}",
                    firstName:   "Pending",
                    lastName:    "User",
                    gender:      "Other",
                    dateOfBirth: "2000-01-01",
                    countryCode: "US"
                ) { token player { userId } }
                }
            `
            })
            .expect(200);

        const signInRes = await request(app)
            .post('/graphql')
            .set('Cookie', csrfCookie as string)
            .set('x-csrf-token', csrfToken)
            .send({
            query: `
                mutation {
                signIn(email: "${testEmail}", password: "${testPassword}") {
                    token
                    player { id }
                }
                }
            `
            })
            .expect(200);

        expect(signInRes.body.data).toBeNull();
        expect(signInRes.body.errors).toBeDefined();
        expect(signInRes.body.errors[0].message).toMatch(/not verified/i);
    });
});
