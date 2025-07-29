import request from 'supertest';
import { app } from './setup';
import { TEST_USER } from './user.seed';

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
});
