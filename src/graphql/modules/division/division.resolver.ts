import { DivisionService } from '../../../services/DivisionService';
import { logger } from '../../../utils/logger';

const divisionService = new DivisionService();

export const divisionResolvers = {
  Query: {
    Divisions: async (_: any, __: any) => {
      try {
        const divisions = await divisionService.getDivisions();
        return divisions;
      } catch (error) {
        logger.error("Error fetching divisions: %o", error);
        throw new Error("Failed to fetch divisions");
      }
    },
    Division: async (_: any, args: { id: string }) => {
      try {
        const division = await divisionService.getDivision(args.id);
        return division || null;
      } catch (error) {
        logger.error("Error fetching division: %o", error);
        throw new Error("Failed to fetch division");
      }
    },
  },
};

