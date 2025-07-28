import { strapiClient } from '../strapi.client';
import { ArticleDTO }  from './article.dto';

export class ArticleService {

  async getArticles(): Promise<ArticleDTO[]> {
    const response = await strapiClient.get<{ data: any[] }>('/articles?populate=*');
    return response.data.data.map(item => ({
      id: item.id.toString(),
      title: item.attributes.title,
      content: item.attributes.content,
      publishedAt: new Date(item.attributes.publishedAt),
    }));
  }
}