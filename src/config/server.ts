import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { env } from './env';
import { pool } from './database';
import { schema } from '../graphql/schema';
import { authMiddleware } from '../middleware/auth.middleware';
import { errorMiddleware } from '../middleware/error.middleware';
import { logger } from '../utils/logger';
import { createContext } from '../graphql/context';

export const server = new ApolloServer({ schema });

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: req => (req as any).token || '',
  cookieName: '__Host-XSRF-TOKEN',
  cookieOptions: {
    httpOnly: false,          
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
  getCsrfTokenFromRequest: req => (req.headers['x-csrf-token'] as string) || undefined,
});

export function buildApp() {
  const app = express();

  app.use(cookieParser());

  app.use(
    '/graphql',
    cors({ origin: env.CLIENT_URL, credentials: true })
  );

  app.get(
    '/csrf-token',
    (req, res, next) => doubleCsrfProtection(req, res, next),
    (req, res) => {
      const token = generateCsrfToken(req, res);
      res.json({ csrfToken: token });
    }
  );

  app.use('/graphql', express.json(), doubleCsrfProtection);

  app.use(authMiddleware);

  app.use(
    '/graphql',
    expressMiddleware(server, { context: createContext }) as unknown as express.RequestHandler
  );

  app.use(errorMiddleware);

  return app;
}

export async function startServer() {
  await server.start();

  const app = buildApp();

  app.listen(env.PORT, () =>
    logger.info(`Server ready at http://localhost:${env.PORT}/graphql`)
  );
}
