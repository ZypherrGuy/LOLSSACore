import { IUserRepository, UserRepository } from './user.repository';
import { UserDTO } from './user.dto';

export class UserService {
  constructor(private userRepo: IUserRepository = new UserRepository()) {}

  async getUsers(): Promise<UserDTO[]> {
    return await this.userRepo.getAll();
  }

  async getUser(id: string): Promise<UserDTO | null> {
    return await this.userRepo.getById(id);
  }
}
