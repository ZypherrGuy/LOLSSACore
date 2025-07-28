import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { env }    from '../config/env';

export interface AuthPayload {
  playerId: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
  token?: string;
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice(7);
  req.token = token;

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch (err) {
    logger.warn('Invalid or expired JWT:', err);
  }

  next();
}
