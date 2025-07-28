import { pool } from '../../config/database';
import {
  PlayerStatsDTO,
  TeamStatsDTO,
  AwardTypeDTO,
  PlayerWeeklyAwardDTO,
  TeamWeeklyAwardDTO
} from './stats.dto';

export class StatsRepository {
  async getPlayerStats(weekStart: Date): Promise<PlayerStatsDTO[]> {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 7);

    const res = await pool.query(
      `SELECT player_id AS "playerId", stat_key, SUM(stat_value) AS value
       FROM player_stats_daily
       WHERE stat_date >= $1 AND stat_date < $2
       GROUP BY player_id, stat_key`,
      [weekStart, end]
    );

    // aggregate stats per player
    const map: Record<string, Record<string, number>> = {};
    res.rows.forEach(({ playerId, stat_key, value }) => {
      map[playerId] = map[playerId] || {};
      map[playerId][stat_key] = Number(value);
    });

    return Object.entries(map).map(([playerId, stats]) => ({ playerId, stats }));
  }

  async getTeamStats(weekStart: Date): Promise<TeamStatsDTO[]> {
    const res = await pool.query(
      `SELECT team_id AS "teamId", stat_key, stat_value AS value
       FROM team_stats_weekly
       WHERE week_start = $1`,
      [weekStart]
    );

    const map: Record<string, Record<string, number>> = {};
    res.rows.forEach(({ teamId, stat_key, value }) => {
      map[teamId] = map[teamId] || {};
      map[teamId][stat_key] = Number(value);
    });

    return Object.entries(map).map(([teamId, stats]) => ({ teamId, stats }));
  }

  async getAwardTypes(): Promise<AwardTypeDTO[]> {
    const res = await pool.query(
      `SELECT id, name, logo_url AS "logoUrl" FROM award_types`
    );
    return res.rows;
  }

  async getPlayerWeeklyAwards(weekStart: Date): Promise<PlayerWeeklyAwardDTO[]> {
    const res = await pool.query(
      `SELECT award_type_id AS "awardTypeId", player_id AS "playerId"
       FROM player_weekly_awards
       WHERE week_start = $1`,
      [weekStart]
    );
    return res.rows;
  }

  async getTeamWeeklyAwards(weekStart: Date): Promise<TeamWeeklyAwardDTO[]> {
    const res = await pool.query(
      `SELECT award_type_id AS "awardTypeId", team_id AS "teamId"
       FROM team_weekly_awards
       WHERE week_start = $1`,
      [weekStart]
    );
    return res.rows;
  }
}