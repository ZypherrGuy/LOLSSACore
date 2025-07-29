import { server, buildApp } from '../src/config/server';
import { seedTestUser, cleanupTestUser } from './user.seed';

export let app: ReturnType<typeof buildApp>;

beforeAll(async () => {
  await server.start();

  app = buildApp();

  await seedTestUser();
});

afterAll(async () => {
  await cleanupTestUser();

  await server.stop();
});
