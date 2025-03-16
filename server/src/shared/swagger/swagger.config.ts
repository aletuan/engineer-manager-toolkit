import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Engineer Manager Toolkit API',
      version,
      description: 'API documentation for the Engineer Manager Toolkit',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Squad: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'code', 'createdAt', 'updatedAt'],
        },
        SquadMember: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            squadId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            pid: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            position: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'squadId', 'userId', 'pid', 'fullName', 'email', 'phone', 'position', 'status', 'createdAt', 'updatedAt'],
        },
        CreateSquadDto: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
          },
          required: ['name'],
        },
        UpdateSquadDto: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
          },
        },
        AddMemberDto: {
          type: 'object',
          properties: {
            userId: { type: 'string', format: 'uuid' },
            pid: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            position: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          },
          required: ['userId', 'pid', 'fullName', 'email', 'phone', 'position'],
        },
        UpdateMemberDto: {
          type: 'object',
          properties: {
            fullName: { type: 'string' },
            phone: { type: 'string' },
            position: { type: 'string' },
            avatarUrl: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
          },
        },
        IncidentRotation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            squadId: { type: 'string', format: 'uuid' },
            primaryMemberId: { type: 'string', format: 'uuid' },
            secondaryMemberId: { type: 'string', format: 'uuid' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            sprintNumber: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'squadId', 'primaryMemberId', 'secondaryMemberId', 'startDate', 'endDate', 'sprintNumber', 'createdAt', 'updatedAt'],
        },
        CreateRotationDto: {
          type: 'object',
          properties: {
            squadId: { type: 'string', format: 'uuid' },
            primaryMemberId: { type: 'string', format: 'uuid' },
            secondaryMemberId: { type: 'string', format: 'uuid' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            sprintNumber: { type: 'number' },
          },
          required: ['squadId', 'primaryMemberId', 'secondaryMemberId', 'startDate', 'endDate', 'sprintNumber'],
        },
        UpdateRotationDto: {
          type: 'object',
          properties: {
            primaryMemberId: { type: 'string', format: 'uuid' },
            secondaryMemberId: { type: 'string', format: 'uuid' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            sprintNumber: { type: 'number' },
          },
        },
        RotationSwap: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            rotationId: { type: 'string', format: 'uuid' },
            requesterId: { type: 'string', format: 'uuid' },
            accepterId: { type: 'string', format: 'uuid' },
            swapDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'rotationId', 'requesterId', 'accepterId', 'swapDate', 'status', 'createdAt', 'updatedAt'],
        },
        CreateSwapDto: {
          type: 'object',
          properties: {
            rotationId: { type: 'string', format: 'uuid' },
            requesterId: { type: 'string', format: 'uuid' },
            accepterId: { type: 'string', format: 'uuid' },
            swapDate: { type: 'string', format: 'date' },
          },
          required: ['rotationId', 'requesterId', 'accepterId', 'swapDate'],
        },
        UpdateSwapDto: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          },
          required: ['status'],
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'number' },
            message: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'object' },
          },
          required: ['status', 'message', 'code'],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 