import { PlayerDTO } from '../player/player.dto';

export interface LoginResponseDTO {
  token: string;
  player: PlayerDTO;
}