import { UserRepository, IUserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepo: IUserRepository = new UserRepository()) {}

  async getUsers(): Promise<any[]> {
    // (Potentially add business logic here)
    return await this.userRepo.getAll();
  }

  async getUser(id: string): Promise<any> {
    // (Potentially add business logic here)
    return await this.userRepo.getById(id);
  }
}
