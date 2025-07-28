import { AuthService } from './auth.service';
import { logger }      from '../../utils/logger';
import { LoginResponseDTO } from './auth.dto';

const authService = new AuthService();

export const authResolvers = {
  Mutation: {
    signIn: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<LoginResponseDTO> => {
      try {
        return await authService.signIn(email, password);
      } catch (error) {
        logger.error('Error signing in:', error);
        throw new Error('Authentication failed');
      }
    },

    signOut: async (
      _: unknown,
      __: any,
      context: { token?: string }
    ): Promise<boolean> => {
      try {
        return await authService.signOut(context.token || '');
      } catch (error) {
        logger.error('Error signing out:', error);
        throw new Error('Logout failed');
      }
    },
  },
};