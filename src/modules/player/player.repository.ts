import { pool } from '../../config/database';
import {
  PlayerDTO,
  LinkedAccountDTO,
  RiotAccountDTO,
  PlayerWithPasswordDTO
} from './player.dto';

export interface IPlayerRepository {
  getAll(): Promise<PlayerDTO[]>;
  getById(id: string): Promise<PlayerDTO | null>;
  getByEmail(email: string): Promise<PlayerWithPasswordDTO | null>;
  getByTeam(teamId: string): Promise<PlayerDTO[]>;
  getLinkedAccounts(playerId: string): Promise<LinkedAccountDTO[]>;
  getRiotAccount(userId: string): Promise<RiotAccountDTO | null>;
}

export class PlayerRepository implements IPlayerRepository {
  private readonly table = 'players';

  async getAll(): Promise<PlayerDTO[]> {
    const result = await pool.query(
      `SELECT
         id,
         user_id AS "userId",
         first_name AS "firstName",
         last_name AS "lastName",
         gender,
         date_of_birth AS "dateOfBirth",
         city,
         country_code AS "countryCode",
         profile_picture_url AS "profilePictureUrl",
         player_rating AS "playerRating",
         current_team_id AS "currentTeamId",
         created_at AS "createdAt",
         updated_at AS "updatedAt"
       FROM ${this.table}`
    );
    return result.rows;
  }

  async getById(id: string): Promise<PlayerDTO | null> {
    const result = await pool.query(
      `SELECT
         id,
         user_id AS "userId",
         first_name AS "firstName",
         last_name AS "lastName",
         gender,
         date_of_birth AS "dateOfBirth",
         city,
         country_code AS "countryCode",
         profile_picture_url AS "profilePictureUrl",
         player_rating AS "playerRating",
         current_team_id AS "currentTeamId",
         created_at AS "createdAt",
         updated_at AS "updatedAt"
       FROM ${this.table}
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getByEmail(email: string): Promise<PlayerWithPasswordDTO | null> {
    const result = await pool.query(
      `SELECT
         p.id,
         p.user_id            AS "userId",
         p.first_name         AS "firstName",
         p.last_name          AS "lastName",
         p.gender,
         p.date_of_birth      AS "dateOfBirth",
         p.city,
         p.country_code       AS "countryCode",
         p.profile_picture_url AS "profilePictureUrl",
         p.player_rating      AS "playerRating",
         p.current_team_id    AS "currentTeamId",
         p.created_at         AS "createdAt",
         p.updated_at         AS "updatedAt",
         u.password_hash      AS password
       FROM ${this.table} p
       JOIN users u ON u.id = p.user_id
       WHERE u.email = $1`,
      [email]
    );
    return (result.rows[0] as PlayerWithPasswordDTO) || null;
  }

  async getByTeam(teamId: string): Promise<PlayerDTO[]> {
    const result = await pool.query(
      `SELECT
         p.id,
         p.user_id      AS "userId",
         p.first_name   AS "firstName",
         p.last_name    AS "lastName",
         p.gender,
         p.date_of_birth AS "dateOfBirth",
         p.city,
         p.country_code AS "countryCode",
         p.profile_picture_url AS "profilePictureUrl",
         p.player_rating      AS "playerRating",
         p.current_team_id    AS "currentTeamId",
         p.created_at         AS "createdAt",
         p.updated_at         AS "updatedAt"
       FROM players p
       JOIN team_members tm ON p.id = tm.player_id
       WHERE tm.team_id = $1`,
      [teamId]
    );
    return result.rows;
  }

  async getLinkedAccounts(playerId: string): Promise<LinkedAccountDTO[]> {
    const result = await pool.query(
      `SELECT
         id,
         platform,
         account_identifier AS "accountIdentifier",
         metadata,
         verified,
         linked_at AS "linkedAt"
       FROM linked_accounts
       WHERE player_id = $1`,
      [playerId]
    );
    return result.rows;
  }

  async getRiotAccount(userId: string): Promise<RiotAccountDTO | null> {
    const result = await pool.query(
      `SELECT
         puuid,
         riot_username AS "gameName",
         riot_id_tagline AS "tagLine",
         region,
         verified,
         linked_at AS "linkedAt"
       FROM riot_accounts
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }
}