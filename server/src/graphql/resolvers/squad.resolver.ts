import { SquadService } from '../services/squad.service';

const squadService = new SquadService();

export const squadResolvers = {
  Query: {
    squads: async () => {
      const squads = await squadService.getSquads();
      return squads.map((squad: any) => ({
        ...squad,
        members: squad.members || []
      }));
    },
    squad: async (_: any, { id }: { id: string }) => {
      const squad = await squadService.getSquadById(id);
      if (!squad) return null;
      return {
        ...squad,
        members: squad.members || []
      };
    },
  },
}; 