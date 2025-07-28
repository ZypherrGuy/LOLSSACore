import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { env } from './env';
import { pool } from './database';
import { schema } from '../graphql/schema';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { errorMiddleware } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export async function startServer() {
  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();

  app.use(authMiddleware);

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {    
        const authReq = req as unknown as AuthRequest;
        return {
          db:    pool,
          env,
          user:  authReq.user  ?? null,
          token: authReq.token ?? null,
        };
      },
    }) as unknown as express.RequestHandler
  );

  app.use(errorMiddleware);

  const port = env.PORT;
  app.listen(port, () =>
    logger.info(`Server ready at http://localhost:${port}/graphql`)
  );
}
