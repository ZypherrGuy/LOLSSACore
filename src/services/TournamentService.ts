import { TournamentRepository, ITournamentRepository } from '../repositories/TournamentRepository';

export class TournamentService {
  constructor(private tournamentRepo: ITournamentRepository = new TournamentRepository()) {}

  async getTournaments(): Promise<any[]> {
    return await this.tournamentRepo.getAll();
  }

  async getTournament(id: string): Promise<any> {
    return await this.tournamentRepo.getById(id);
  }
}
