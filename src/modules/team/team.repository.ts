import { pool } from '../../config/database';
import { TeamDTO, TeamSocialAccountDTO } from './team.dto';

export interface ITeamRepository {
  getAll(): Promise<TeamDTO[]>;
  getById(id: string): Promise<TeamDTO | null>;
}

export class TeamRepository implements ITeamRepository {
  private readonly table = 'teams';

  async getAll(): Promise<TeamDTO[]> {
    const result = await pool.query(
      `SELECT
         t.id,
         t.name,
         t.tag,
         t.logo_url     AS "logoUrl",
         t.bio,
         t.gender_type AS "genderType",
         t.created_by  AS "createdBy",
         t.created_at  AS "createdAt",
         t.updated_at  AS "updatedAt"
       FROM ${this.table} t`
    );
    const teams: TeamDTO[] = result.rows;

    for (const team of teams) {
      const soc = await pool.query(
        `SELECT id, platform, account_url AS "accountUrl"
         FROM team_social_accounts
         WHERE team_id = $1`,
        [team.id]
      );
      team.socialAccounts = soc.rows;
    }

    return teams;
  }

  async getById(id: string): Promise<TeamDTO | null> {
    const result = await pool.query(
      `SELECT
         t.id,
         t.name,
         t.tag,
         t.logo_url     AS "logoUrl",
         t.bio,
         t.gender_type AS "genderType",
         t.created_by  AS "createdBy",
         t.created_at  AS "createdAt",
         t.updated_at  AS "updatedAt"
       FROM ${this.table} t
       WHERE t.id = $1`,
      [id]
    );
    const team = result.rows[0];
    if (!team) return null;

    const soc = await pool.query(
      `SELECT id, platform, account_url AS "accountUrl"
       FROM team_social_accounts
       WHERE team_id = $1`,
      [id]
    );
    team.socialAccounts = soc.rows;

    return team;
  }
}