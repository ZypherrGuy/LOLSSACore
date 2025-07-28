import { strapiClient } from '../strapi.client';
import { MatchSummaryDTO } from './match.dto';

export class MatchService {

  async getMatches(): Promise<MatchSummaryDTO[]> {
    const response = await strapiClient.get<{ data: any[] }>('/matches?populate=*');
    return response.data.data.map(item => ({
      id: item.id.toString(),
      matchId: item.attributes.matchId,
      scheduledAt: new Date(item.attributes.scheduledAt),
      completed: Boolean(item.attributes.completed),
    }));
  }
}