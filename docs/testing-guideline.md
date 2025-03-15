# Testing Guide

This document provides instructions for running tests in the Engineer Manager Toolkit project.

## Prerequisites

Before running tests, ensure you have:

1. Node.js v20.17.0 or later installed
2. PNPM package manager installed
3. PostgreSQL database running locally
4. Environment variables set up correctly in `server/.env`

## Running Squad Tests

The Squad module tests verify the functionality of squad-related endpoints, including:
- Creating squads
- Retrieving squad information
- Managing squad members
- Updating squad details

### Running the Tests

1. First, ensure the server is running in development mode:
```bash
cd server
pnpm dev
```

2. In a separate terminal, run the squad tests:
```bash
cd server
pnpm ts-node src/modules/squads/tests/squad.test.ts
```

### Test Coverage

The squad tests cover the following endpoints:

1. `GET /api/v1/squads`
   - Retrieves all squads
   - Returns an array of squad objects

2. `GET /api/v1/squads/:id`
   - Retrieves a specific squad by ID
   - Returns a single squad object

3. `GET /api/v1/squads/:id/members`
   - Retrieves all members of a specific squad
   - Returns an array of squad member objects

### Expected Test Output

When tests run successfully, you should see output similar to:

```
Testing GET /squads
All squads: [
  {
    id: '6b716faf-5d53-4817-aabf-3aaa0038bf85',
    name: 'Squad Sonic',
    code: 'SONIC',
    description: 'Frontend and Backend Development Team',
    createdAt: '2025-03-15T16:34:13.199Z',
    updatedAt: '2025-03-15T16:34:13.199Z'
  },
  ...
]

Testing GET /squads/:id
Single squad: {
  id: '6b716faf-5d53-4817-aabf-3aaa0038bf85',
  name: 'Squad Sonic',
  ...
}

Testing GET /squads/:id/members
Squad members: [
  {
    id: '1aefd661-cdc2-4103-bb98-bb1e3dca1ee0',
    squadId: '6b716faf-5d53-4817-aabf-3aaa0038bf85',
    ...
  },
  ...
]
```

### Troubleshooting

If tests fail, check:

1. Server is running on port 3001
2. Database is accessible and contains seed data
3. Environment variables are correctly set
4. No port conflicts with other services

## Adding New Tests

When adding new tests:

1. Create test files in the appropriate module's `tests` directory
2. Follow the existing test structure for consistency
3. Use axios for HTTP requests
4. Include proper error handling
5. Add clear console output for test results

## Continuous Integration

The test suite is also run in the CI pipeline. Ensure all tests pass locally before pushing changes. 