import { GQLContext } from '../../graphql/context';
import { env }        from '../../config/env';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from './auth.dto';
import { RegisterInput } from './auth.service';

const authService = new AuthService();

export const authResolvers = {
  Mutation: {
    signIn: async (
      _: any,
      { email, password }: { email: string; password: string },
      ctx: GQLContext
    ) => {
      const { token, player } = await authService.signIn(email, password);

      ctx.res.cookie('jid', token, {
        httpOnly: true,
        secure:   env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
        maxAge:   1000 * 60 * 60,    // 1h
      });

      return { token, player };
    },

    signOut: async (_: any, __: any, ctx: GQLContext) => {
      ctx.res.clearCookie('jid', {
        httpOnly: true,
        secure:   env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
      });

      return authService.signOut(ctx.token || '');
    },

    register: async (
      _: unknown,
      args: RegisterInput,
      ctx: GQLContext
    ): Promise<LoginResponseDTO> => {
      const input = { ...args, dateOfBirth: new Date(args.dateOfBirth) };
      const { token, player } = await authService.register(input);

      ctx.res.cookie('jid', token, {
        httpOnly: true,
        secure:   env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
        maxAge:   3600 * 1000,
      });

      return { token, player };
    },
  },
};
