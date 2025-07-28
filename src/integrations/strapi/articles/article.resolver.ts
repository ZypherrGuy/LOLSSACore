import { ArticleService } from './article.service';
import { logger }         from '../../../utils/logger';
import { ArticleDTO }     from './article.dto';

const articleService = new ArticleService();

export const articleResolvers = {
  Query: {
    articles: async (): Promise<ArticleDTO[]> => {
      try {
        return await articleService.getArticles();
      } catch (error) {
        logger.error('Error fetching articles from Strapi:', error);
        throw new Error('Failed to fetch articles');
      }
    },
  },
};
