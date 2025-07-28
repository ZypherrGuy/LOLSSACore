import { DivisionRepository, IDivisionRepository } from '../repositories/DivisionRepository';

export class DivisionService {
  constructor(private divisionRepo: IDivisionRepository = new DivisionRepository()) {}

  async getDivisions(): Promise<any[]> {
    return await this.divisionRepo.getAll();
  }

  async getDivision(id: string): Promise<any> {
    return await this.divisionRepo.getById(id);
  }
}
