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

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  let rawToken: string | undefined = req.cookies?.jid;

  if (!rawToken && req.headers.authorization?.startsWith('Bearer ')) {
    rawToken = req.headers.authorization.slice(7);
  }

  if (rawToken) {
    req.token = rawToken;
    try {
      req.user = jwt.verify(rawToken, env.JWT_SECRET) as AuthPayload;
    } catch (err) {
      logger.warn('Invalid or expired JWT:', err);
    }
  }

  next();
}
