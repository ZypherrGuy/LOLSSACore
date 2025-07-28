import { pool } from '../../config/database';
import { TournamentDTO, PlacementDTO, MatchSummaryDTO } from './tournament.dto';

export interface ITournamentRepository {
  getAll(): Promise<TournamentDTO[]>;
  getById(id: string): Promise<TournamentDTO | null>;
}

export class TournamentRepository implements ITournamentRepository {
  private readonly table = 'tournaments';

  async getAll(): Promise<TournamentDTO[]> {
    const { rows } = await pool.query(
      `SELECT
         id,
         name,
         slug,
         description,
         logo_url     AS "logoUrl",
         banner_url   AS "bannerUrl",
         prize_pool   AS "prizePool",
         organizer_name         AS "organizerName",
         organizer_discord_url  AS "organizerDiscordUrl",
         organizer_website_url  AS "organizerWebsiteUrl",
         status,
         format,
         start_date   AS "startDate",
         end_date     AS "endDate",
         created_at   AS "createdAt",
         updated_at   AS "updatedAt"
       FROM ${this.table}`
    );
    const tournaments: TournamentDTO[] = [];
    for (const t of rows) {
      const placementsRes = await pool.query<PlacementDTO>(
        `SELECT
           first_entry_id    AS "firstEntryId",
           first_entry_type  AS "firstEntryType",
           second_entry_id   AS "secondEntryId",
           second_entry_type AS "secondEntryType",
           third_entry_id    AS "thirdEntryId",
           third_entry_type  AS "thirdEntryType"
         FROM tournament_placements
         WHERE tournament_id = $1`,
        [t.id]
      );
      const placements = placementsRes.rows[0] || null;

      const matchesRes = await pool.query<MatchSummaryDTO>(
        `SELECT
           id,
           match_id      AS "matchId",
           scheduled_at  AS "scheduledAt",
           completed
         FROM matches
         WHERE tournament_id = $1
         ORDER BY scheduled_at DESC`,
        [t.id]
      );
      const matches = matchesRes.rows;

      tournaments.push({
        ...t,
        placements,
        matches,
      });
    }
    return tournaments;
  }

  async getById(id: string): Promise<TournamentDTO | null> {
    const { rows } = await pool.query(
      `SELECT
         id,
         name,
         slug,
         description,
         logo_url     AS "logoUrl",
         banner_url   AS "bannerUrl",
         prize_pool   AS "prizePool",
         organizer_name         AS "organizerName",
         organizer_discord_url  AS "organizerDiscordUrl",
         organizer_website_url  AS "organizerWebsiteUrl",
         status,
         format,
         start_date   AS "startDate",
         end_date     AS "endDate",
         created_at   AS "createdAt",
         updated_at   AS "updatedAt"
       FROM ${this.table}
       WHERE id = $1`,
      [id]
    );
    const t = rows[0];
    if (!t) return null;

    const placementsRes = await pool.query<PlacementDTO>(
      `SELECT
         first_entry_id    AS "firstEntryId",
         first_entry_type  AS "firstEntryType",
         second_entry_id   AS "secondEntryId",
         second_entry_type AS "secondEntryType",
         third_entry_id    AS "thirdEntryId",
         third_entry_type  AS "thirdEntryType"
       FROM tournament_placements
       WHERE tournament_id = $1`,
      [id]
    );
    const placements = placementsRes.rows[0] || null;

    const matchesRes = await pool.query<MatchSummaryDTO>(
      `SELECT
         id,
         match_id      AS "matchId",
         scheduled_at  AS "scheduledAt",
         completed
       FROM matches
       WHERE tournament_id = $1
       ORDER BY scheduled_at DESC`,
      [id]
    );
    const matches = matchesRes.rows;

    return { ...t, placements, matches };
  }
}