import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import { IAuthRepository, AuthRepository } from './auth.repository';
import { LoginResponseDTO }                 from './auth.dto';
import {
  IPlayerRepository,
  PlayerRepository,
  PlayerDTO,
} from '../player/player.repository'; 
import { sendVerificationEmail } from '../../utils/email';
import { sendPasswordResetEmail } from '../../utils/email';

import { pool } from '../../config/database';

export interface RegisterInput {
  username:    string;
  email:       string;
  password:    string;
  firstName:   string;
  lastName:    string;
  gender:      'Male' | 'Female' | 'Other';
  dateOfBirth: Date;
  countryCode?: string;
}

export class AuthService {
  constructor(
    private authRepo:   IAuthRepository     = new AuthRepository(),
    private playerRepo: IPlayerRepository   = new PlayerRepository()
  ) {}

  async signIn(email: string, password: string): Promise<LoginResponseDTO> {
    const player = await this.authRepo.getPlayerByEmail(email);
    if (!player) {
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, player.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const verified = await this.authRepo.isEmailVerified(player.userId);
    if (!verified) {
      throw new Error('Email not verified');
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

  async register(input: RegisterInput): Promise<LoginResponseDTO> {
    const passwordHash = await bcrypt.hash(input.password, 10);

    const userId = uuidv4();
    await this.authRepo.createUser(
      userId,
      input.username,
      input.email,
      passwordHash
    );

    const playerId = uuidv4();
    const player = await this.playerRepo.createProfile({
      id:           playerId,
      userId,
      firstName:    input.firstName,
      lastName:     input.lastName,
      gender:       input.gender,
      dateOfBirth:  input.dateOfBirth,
      countryCode:  input.countryCode,
    });

    if (!player) {
      throw new Error('Failed to create player profile');
    }

    const token = jwt.sign({ playerId: player.id }, env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const signinTokenExpiresAt = new Date(Date.now() + 3600 * 1000);

    await this.authRepo.createSession(player.id, token, signinTokenExpiresAt);

    const emailVerifyToken = uuidv4();
    const emailVerifyTokenExpiresAt = new Date(Date.now() + 24*3600*1000); 
    await this.authRepo.saveVerificationToken(userId, emailVerifyToken, emailVerifyTokenExpiresAt);
    await sendVerificationEmail(input.email, emailVerifyToken);
    
    return {
      token,
      player,
    };
  }

  async verifyEmail(token: string): Promise<boolean> {
    const row = await this.authRepo.findVerificationToken(token);
    if (!row || row.expires_at < new Date()) {
      throw new Error('Invalid or expired verification token');
    }
    await pool.query(
      `UPDATE users SET is_email_verified = TRUE WHERE id = $1`,
      [row.user_id]
    );
    await this.authRepo.deleteVerificationToken(token);
    return true;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    const player = await this.authRepo.getPlayerByEmail(email);
    if (!player) return true; 

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1h

    await this.authRepo.savePasswordResetToken(player.userId, resetToken, expiresAt);
    await sendPasswordResetEmail(email, resetToken);
    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const row = await this.authRepo.findPasswordResetToken(token);
    if (!row || row.expires_at < new Date()) {
      throw new Error('Invalid or expired password reset token');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [hash, row.user_id]
    );

    await this.authRepo.deletePasswordResetToken(token);
    return true;
  }
}