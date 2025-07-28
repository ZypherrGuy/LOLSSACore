// auth.middleware.ts
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthPayload {
  id: string;
  email: string;
}

export const getUserFromAuthHeader = (authHeader?: string): AuthPayload | null => {
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
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    return jwt.verify(token, secret) as AuthPayload;
  } catch (error) {
    logger.warn('Token verification failed.', error);
    return null;
  }
};
