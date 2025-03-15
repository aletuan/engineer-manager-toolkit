import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './shared/config';
import { errorHandler } from './shared/errors/errorHandler';
import { notFoundHandler } from './shared/errors/notFoundHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
});
app.use(limiter);

// Routes will be added here
// app.use('/api/v1/squads', squadRoutes);
// app.use('/api/v1/tasks', taskRoutes);
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app; 