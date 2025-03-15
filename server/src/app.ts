import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './shared/config';
import { errorHandler } from './shared/errors/errorHandler';
import { notFoundHandler } from './shared/errors/notFoundHandler';
import { PrismaClient } from '@prisma/client';
import { SquadRepository } from './modules/squads/repositories/squad.repository';
import { SquadService } from './modules/squads/services/squad.service';
import { SquadController } from './modules/squads/controllers/squad.controller';
import { createSquadRouter } from './modules/squads/routes/squad.routes';
import { swaggerSpec } from './shared/swagger/swagger.config';

const app = express();
const prisma = new PrismaClient();

// Initialize repositories
const squadRepository = new SquadRepository(prisma);

// Initialize services
const squadService = new SquadService(squadRepository);

// Initialize controllers
const squadController = new SquadController(squadService);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for Swagger UI
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
});
app.use(limiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Engineer Manager Toolkit API Documentation',
}));

// Routes
app.use('/api/v1/squads', createSquadRouter(squadController));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app; 