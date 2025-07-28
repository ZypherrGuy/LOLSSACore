import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import dotenv from 'dotenv';
import { getUserFromAuthHeader } from './middleware/auth.middleware';
import { logger } from './utils/logger';
import pool from './config/postgres';

dotenv.config();

export interface MyContext {
  db: typeof pool;
  token?: string;
  user?: any;
}

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer<MyContext>({ typeDefs, resolvers });

  await apolloServer.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware<MyContext>(apolloServer, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const user = getUserFromAuthHeader(token);
        if (user) {
          logger.info('User authenticated: %o', user);
        }
        return { db: pool, token, user };
      },
    }) as any
  );

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  logger.error('Error starting server: %o', err);
});
