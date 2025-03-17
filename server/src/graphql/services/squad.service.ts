import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1';

export class SquadService {
  async getSquads() {
    const response = await axios.get(`${API_BASE_URL}/squads`);
    const squads = response.data;

    // Get members for each squad
    const squadsWithMembers = await Promise.all(
      squads.map(async (squad: any) => {
        const membersResponse = await axios.get(`${API_BASE_URL}/squads/${squad.id}/members`);
        return {
          ...squad,
          members: membersResponse.data
        };
      })
    );

    return squadsWithMembers;
  }

  async getSquadById(id: string) {
    const [squadResponse, membersResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/squads/${id}`),
      axios.get(`${API_BASE_URL}/squads/${id}/members`)
    ]);

    return {
      ...squadResponse.data,
      members: membersResponse.data
    };
  }
} 