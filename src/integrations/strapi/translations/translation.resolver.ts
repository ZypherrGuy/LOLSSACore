import { TranslationService } from './translation.service';
import { logger }              from '../../../utils/logger';
import { TranslationDTO }      from './translation.dto';

const translationService = new TranslationService();

export const translationResolvers = {
  Query: {
    translations: async (_: unknown, { locale }: { locale: string }): Promise<TranslationDTO[]> => {
      try {
        return await translationService.getTranslations(locale);
      } catch (error) {
        logger.error('Error fetching translations from Strapi:', error);
        throw new Error('Failed to fetch translations');
      }
    },
  },
};