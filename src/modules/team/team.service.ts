import { ITeamRepository, TeamRepository } from './team.repository';
import { TeamDTO } from './team.dto';

export class TeamService {
  constructor(private teamRepo: ITeamRepository = new TeamRepository()) {}

  async getTeams(): Promise<TeamDTO[]> {
    return this.teamRepo.getAll();
  }

  async getTeam(id: string): Promise<TeamDTO | null> {
    return this.teamRepo.getById(id);
  }
}