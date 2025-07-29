// modules/auth/auth.resolver.ts
import { GQLContext } from '../../graphql/context';
import { env }        from '../../config/env';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const authResolvers = {
  Mutation: {
    signIn: async (
      _: any,
      { email, password }: { email: string; password: string },
      ctx: GQLContext
    ) => {
      const { token, player } = await authService.signIn(email, password);

      // 1) set JWT in an HttpOnly cookie
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
      // 2) clear the cookie on logout
      ctx.res.clearCookie('jid', {
        httpOnly: true,
        secure:   env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
      });

      return authService.signOut(ctx.token || '');
    },
  },
};
