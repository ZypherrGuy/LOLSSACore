import { strapiClient } from '../strapi.client';
import { TranslationDTO } from './translation.dto';

export class TranslationService {

  async getTranslations(locale: string): Promise<TranslationDTO[]> {
    const response = await strapiClient.get<{ data: any[] }>(
      `/translations?filters[locale][$eq]=${encodeURIComponent(locale)}&populate=*`
    );
    return response.data.data.map(item => ({
      id: item.id.toString(),
      key: item.attributes.key,
      value: item.attributes.value,
      locale: item.attributes.locale,
    }));
  }
}