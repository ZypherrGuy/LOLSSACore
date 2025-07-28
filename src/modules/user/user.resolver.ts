import { UserService } from './user.service';
import { logger } from '../../utils/logger';
import { UserDTO } from './user.dto';

const userService = new UserService();

export const userResolvers = {
  Query: {
    users: async (): Promise<UserDTO[]> => {
      try {
        return await userService.getUsers();
      } catch (error) {
        logger.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    },
    user: async (_: unknown, { id }: { id: string }): Promise<UserDTO | null> => {
      try {
        return (await userService.getUser(id)) || null;
      } catch (error) {
        logger.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
      }
    }
  }
};