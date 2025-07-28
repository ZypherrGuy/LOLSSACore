import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { IAuthRepository, AuthRepository } from './auth.repository';
import { LoginResponseDTO }                 from './auth.dto';

export class AuthService {
  constructor(private authRepo: IAuthRepository = new AuthRepository()) {}

  async signIn(email: string, password: string): Promise<LoginResponseDTO> {
    const player = await this.authRepo.getPlayerByEmail(email);
    if (!player) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, player.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { playerId: player.id },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    await this.authRepo.createSession(player.id, token, expiresAt);
    delete (player as any).password; 

    return { token, player };
  }

  async signOut(token: string): Promise<boolean> {
    if (!token) {
      throw new Error('Not authenticated');
    }
    const deleted = await this.authRepo.deleteSession(token);
    return !!deleted;
  }
}