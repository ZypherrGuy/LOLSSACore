import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { env } from './env';
import { pool } from './database';
import { schema } from '../graphql/schema';
import { getUserFromAuthHeader } from '../middleware/auth.middleware';
import { errorMiddleware } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export async function startServer() {
  const app = express();

  const apollo = new ApolloServer({ schema });
  await apollo.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const user  = getUserFromAuthHeader(token);
        if (user) {
          logger.info('User authenticated: %o', user);
        }
        return {
          db: pool,
          user,
          token,
          env
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
