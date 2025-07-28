import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export interface AuthPayload {
  playerId: string;
}

export function getUserFromAuthHeader(authHeader?: string): AuthPayload | null {
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logger.warn('Invalid Authorization header format.');
    return null;
  }
  const token = parts[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    return payload;
  } catch (error) {
    logger.warn('Token verification failed.', error);
    return null;
  }
}

export function authMiddleware(
  req: Request & { user?: AuthPayload },
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const user = getUserFromAuthHeader(authHeader);
  if (user) req.user = user;
  next();
}
