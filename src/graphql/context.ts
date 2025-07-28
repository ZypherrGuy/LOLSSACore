import { Request } from 'express';
import { pool }    from '../config/database';
import { env }     from '../config/env';
import { getUserFromAuthHeader } from '../middleware/auth.middleware';

export interface GQLContext {
  db: typeof pool;
  user?: any;
  token?: string;
  env: typeof env;
}

export const createContext = async (
  { req }: { req: Request }
): Promise<GQLContext> => {
  const token = req.headers.authorization;
  const user  = getUserFromAuthHeader(token);
  return { db: pool, user, token, env };
};
