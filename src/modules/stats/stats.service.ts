import { StatsRepository } from './stats.repository';
import { PlayerService }  from '../player/player.service';
import { TeamService }    from '../team/team.service';
import { StatsRepository as Repo } from './stats.repository';

export class StatsService {
  private repo = new StatsRepository();
  private playerService = new PlayerService();
  private teamService   = new TeamService();

  async weeklyPlayerStats(weekStart: Date) {
    const raw = await this.repo.getPlayerStats(weekStart);
    return Promise.all(
      raw.map(async ({ playerId, stats }) => ({
        player: await this.playerService.getPlayer(playerId),
        stats,
      }))
    );
  }

  async weeklyTeamStats(weekStart: Date) {
    const raw = await this.repo.getTeamStats(weekStart);
    return Promise.all(
      raw.map(async ({ teamId, stats }) => ({
        team: await this.teamService.getTeam(teamId),
        stats,
      }))
    );
  }

  async playerAwards(weekStart: Date) {
    const [awards, types] = await Promise.all([
      this.repo.getPlayerWeeklyAwards(weekStart),
      this.repo.getAwardTypes()
    ]);
    return Promise.all(
      awards.map(async ({ awardTypeId, playerId }) => ({
        awardType: types.find(t => t.id === awardTypeId),
        player: await this.playerService.getPlayer(playerId)
      }))
    );
  }

  async teamAwards(weekStart: Date) {
    const [awards, types] = await Promise.all([
      this.repo.getTeamWeeklyAwards(weekStart),
      this.repo.getAwardTypes()
    ]);
    return Promise.all(
      awards.map(async ({ awardTypeId, teamId }) => ({
        awardType: types.find(t => t.id === awardTypeId),
        team: await this.teamService.getTeam(teamId)
      }))
    );
  }
}
