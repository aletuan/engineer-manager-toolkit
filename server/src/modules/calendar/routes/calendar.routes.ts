import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { CalendarService } from '../services/calendar.service';
import { CalendarRepository } from '../repositories/calendar.repository';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../../../shared/middleware/validateRequest';
import { z } from 'zod';
import { addDays, startOfDay } from 'date-fns';

const router = Router();
const prismaClient = new PrismaClient();
const repository = new CalendarRepository(prismaClient);
const service = new CalendarService(repository);
const controller = new CalendarController(service);

// Rotation Routes
router.get('/rotations', controller.getRotations.bind(controller));
router.get('/rotations/:id', controller.getRotationById.bind(controller));
router.post('/rotations', controller.createRotation.bind(controller));
router.put('/rotations/:id', controller.updateRotation.bind(controller));
router.delete('/rotations/:id', controller.deleteRotation.bind(controller));

// Swap Routes
router.get('/swaps', controller.getSwaps.bind(controller));
router.get('/swaps/:id', controller.getSwapById.bind(controller));
router.post('/swaps', controller.createSwap.bind(controller));
router.put('/swaps/:id', controller.updateSwap.bind(controller));
router.delete('/swaps/:id', controller.deleteSwap.bind(controller));

// Availability Routes
router.get('/availability', controller.getAvailability.bind(controller));
router.put('/availability/:id', controller.updateMemberAvailability.bind(controller));

// Standup Hosting Routes
router.get('/standup-hosting/:squadId', controller.getStandupHostingSchedule.bind(controller));

// Incident Rotation Routes
router.get('/incident-rotation/:squadId', controller.getIncidentRotationSchedule.bind(controller));

export default router; 