import { SeasonRepository, ISeasonRepository } from '../repositories/SeasonRepository';

export class SeasonService {
  constructor(private seasonRepo: ISeasonRepository = new SeasonRepository()) {}

  async getSeasons(): Promise<any[]> {
    return await this.seasonRepo.getAll();
  }

  async getSeason(id: string): Promise<any> {
    return await this.seasonRepo.getById(id);
  }
}