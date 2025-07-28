import type { ExpressContextFunctionArgument } from '@apollo/server/express4';
import { pool } from '../config/database';
import { env }  from '../config/env';
import { AuthRequest } from '../middleware/auth.middleware';

export interface GQLContext {
  db: typeof pool;
  env: typeof env;
  user?: { playerId: string } | null;
  token?: string | null;
}

export const createContext = async (
  ctx: ExpressContextFunctionArgument
): Promise<GQLContext> => {
  const req = ctx.req as unknown as AuthRequest;
  return {
    db:    pool,
    env,
    user:  req.user  ?? null,
    token: req.token ?? null,
  };
};
