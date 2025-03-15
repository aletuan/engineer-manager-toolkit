import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1/squads';

async function testSquadEndpoints() {
  try {
    // Test GET /squads
    console.log('\nTesting GET /squads');
    const squadsResponse = await axios.get(BASE_URL);
    console.log('All squads:', squadsResponse.data);

    if (squadsResponse.data.length > 0) {
      const firstSquad = squadsResponse.data[0];
      
      // Test GET /squads/:id
      console.log('\nTesting GET /squads/:id');
      const squadResponse = await axios.get(`${BASE_URL}/${firstSquad.id}`);
      console.log('Single squad:', squadResponse.data);

      // Test GET /squads/:id/members
      console.log('\nTesting GET /squads/:id/members');
      const membersResponse = await axios.get(`${BASE_URL}/${firstSquad.id}/members`);
      console.log('Squad members:', membersResponse.data);
    } else {
      console.log('No squads found. Please create a squad first.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

// Run the tests
testSquadEndpoints(); 