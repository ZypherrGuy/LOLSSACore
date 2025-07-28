import { UserService } from '../../../services/UserService';
import { logger } from '../../../utils/logger';

const userService = new UserService();

export const userResolvers = {
  Query: {
    Users: async (_: any, __: any) => {
      try {
        const users = await userService.getUsers();
        return users;
      } catch (error) {
        logger.error('Error fetching users: %o', error);
        throw new Error('Failed to fetch users');
      }
    },
    User: async (_: any, args: { id: string }) => {
      try {
        const user = await userService.getUser(args.id);
        return user || null;
      } catch (error) {
        logger.error('Error fetching user: %o', error);
        throw new Error('Failed to fetch user');
      }
    },
  },
};
