import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { CalendarService } from '../services/calendar.service';
import { CalendarRepository } from '../repositories/calendar.repository';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateRequest } from '../../../middleware/validate-request.middleware';
import { z } from 'zod';
import { prisma } from '../../../shared/prisma';
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

// Get standup hosting schedule for a squad
router.get('/standup-hosting/:squadId', authMiddleware, async (req, res) => {
  try {
    const { squadId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : startOfDay(new Date());
    const end = endDate ? new Date(endDate as string) : addDays(start, 30);

    const hostings = await prisma.standupHosting.findMany({
      where: {
        squadId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(hostings);
  } catch (error) {
    console.error('Error fetching standup hosting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get incident rotation schedule for a squad
router.get('/incident-rotation/:squadId', authMiddleware, async (req, res) => {
  try {
    const { squadId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : startOfDay(new Date());
    const end = endDate ? new Date(endDate as string) : addDays(start, 30);

    const rotations = await prisma.incidentRotation.findMany({
      where: {
        squadId,
        startDate: {
          lte: end,
        },
        endDate: {
          gte: start,
        },
      },
      include: {
        primaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        secondaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        swaps: {
          include: {
            requester: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
            accepter: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    res.json(rotations);
  } catch (error) {
    console.error('Error fetching incident rotation schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 