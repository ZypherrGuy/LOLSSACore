import {
  IPlayerRepository,
  PlayerRepository
} from './player.repository';
import { PlayerDTO, LinkedAccountDTO, RiotAccountDTO } from './player.dto';

export class PlayerService {
  constructor(
    private playerRepo: IPlayerRepository = new PlayerRepository()
  ) {}

  async getPlayers(): Promise<PlayerDTO[]> {
    return this.playerRepo.getAll();
  }

  async getPlayer(id: string): Promise<PlayerDTO | null> {
    return this.playerRepo.getById(id);
  }

  async getPlayersByTeam(teamId: string): Promise<PlayerDTO[]> {
    return await this.playerRepo.getByTeam(teamId);
  }

  async getLinkedAccounts(playerId: string): Promise<LinkedAccountDTO[]> {
    return this.playerRepo.getLinkedAccounts(playerId);
  }

  async getRiotAccount(userId: string): Promise<RiotAccountDTO | null> {
    return this.playerRepo.getRiotAccount(userId);
  }
}