import { TeamRepository, ITeamRepository } from '../repositories/TeamRepository';

export class TeamService {
  constructor(private teamRepo: ITeamRepository = new TeamRepository()) {}

  async getTeams(): Promise<any[]> {
    // (Potentially add business logic here)
    return await this.teamRepo.getAll();
  }

  async getTeam(id: string): Promise<any> {
    // (Potentially add business logic here)
    return await this.teamRepo.getById(id);
  }
}
