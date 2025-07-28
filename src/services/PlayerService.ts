// PlayerService.ts
import { PlayerRepository, IPlayerRepository } from '../repositories/PlayerRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { RiotService, RiotAccountResponse } from './RiotService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 12;
const JWT_SECRET = process.env.JWT_SECRET || ''; 
const JWT_EXPIRES_IN = '1h'; 

export class PlayerService {
  private riotService: RiotService;
  private playerRepo: IPlayerRepository;
  private sessionRepo: SessionRepository;

  constructor(playerRepo: IPlayerRepository = new PlayerRepository()) {
    this.playerRepo = playerRepo;
    this.riotService = new RiotService();
    this.sessionRepo = new SessionRepository();
  }
  
  async getPlayers(): Promise<any[]> {
    return await this.playerRepo.getAll();
  }

  async getPlayer(id: string): Promise<any> {
    return await this.playerRepo.getById(id);
  }

  async registerPlayer(playerData: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(playerData.password, saltRounds);
    const newPlayer = {
      ...playerData,
      password: hashedPassword,
    };
    return await this.playerRepo.create(newPlayer);
  }

  async loginPlayer(email: string, password: string): Promise<{ token: string; player: any }> {
    const player = await this.playerRepo.getByEmail(email);
    if (!player) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, player.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ playerId: player.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    
    await this.sessionRepo.createSession({ playerId: player.id, token, expiresAt });
    
    return { token, player };
  }

  async fetchRiotAccount(gameName: string, tagLine: string): Promise<RiotAccountResponse> {
    return this.riotService.getAccountByRiotId(gameName, tagLine);
  }
}
