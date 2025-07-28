import { ITournamentRepository, TournamentRepository } from './tournament.repository';
import { TournamentDTO } from './tournament.dto';

export class TournamentService {
  constructor(private repo: ITournamentRepository = new TournamentRepository()) {}

  async getTournaments(): Promise<TournamentDTO[]> {
    return this.repo.getAll();
  }

  async getTournament(id: string): Promise<TournamentDTO | null> {
    return this.repo.getById(id);
  }
}