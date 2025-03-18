import { Request, Response } from 'express';
import { CalendarService } from '../services/calendar.service';
import { CreateRotationInput, UpdateRotationInput, CreateSwapInput, UpdateSwapInput, UpdateAvailabilityInput } from '../types/calendar.types';
import { startOfDay, addDays, startOfMonth, endOfMonth } from 'date-fns';

export class CalendarController {
  constructor(private service: CalendarService) {}

  /**
   * @swagger
   * /api/v1/calendar/rotations:
   *   get:
   *     summary: Get all rotations
   *     tags: [Calendar]
   *     parameters:
   *       - in: query
   *         name: squadId
   *         schema:
   *           type: string
   *         description: Filter by squad ID
   *       - in: query
   *         name: memberId
   *         schema:
   *           type: string
   *         description: Filter by member ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by start date
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by end date
   *     responses:
   *       200:
   *         description: List of rotations
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/IncidentRotation'
   */
  async getRotations(req: Request, res: Response) {
    try {
      const rotations = await this.service.getRotations(req.query);
      res.json(rotations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get rotations' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/rotations/{id}:
   *   get:
   *     summary: Get rotation by ID
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Rotation ID
   *     responses:
   *       200:
   *         description: Rotation details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IncidentRotation'
   *       404:
   *         description: Rotation not found
   */
  async getRotationById(req: Request, res: Response) {
    try {
      const rotation = await this.service.getRotationById(req.params.id);
      if (!rotation) {
        return res.status(404).json({ error: 'Rotation not found' });
      }
      res.json(rotation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get rotation' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/rotations:
   *   post:
   *     summary: Create a new rotation
   *     tags: [Calendar]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRotationDto'
   *     responses:
   *       201:
   *         description: Rotation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IncidentRotation'
   *       400:
   *         description: Invalid input data
   */
  async createRotation(req: Request, res: Response) {
    try {
      const rotation = await this.service.createRotation(req.body as CreateRotationInput);
      res.status(201).json(rotation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create rotation' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/rotations/{id}:
   *   put:
   *     summary: Update rotation
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Rotation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateRotationDto'
   *     responses:
   *       200:
   *         description: Rotation updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/IncidentRotation'
   *       404:
   *         description: Rotation not found
   *       400:
   *         description: Invalid input data
   */
  async updateRotation(req: Request, res: Response) {
    try {
      const rotation = await this.service.updateRotation(
        req.params.id,
        req.body as UpdateRotationInput
      );
      res.json(rotation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update rotation' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/rotations/{id}:
   *   delete:
   *     summary: Delete rotation
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Rotation ID
   *     responses:
   *       204:
   *         description: Rotation deleted successfully
   *       404:
   *         description: Rotation not found
   */
  async deleteRotation(req: Request, res: Response) {
    try {
      await this.service.deleteRotation(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete rotation' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/swaps:
   *   get:
   *     summary: Get all swap requests
   *     tags: [Calendar]
   *     parameters:
   *       - in: query
   *         name: rotationId
   *         schema:
   *           type: string
   *         description: Filter by rotation ID
   *       - in: query
   *         name: requesterId
   *         schema:
   *           type: string
   *         description: Filter by requester ID
   *       - in: query
   *         name: accepterId
   *         schema:
   *           type: string
   *         description: Filter by accepter ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, APPROVED, REJECTED]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of swap requests
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RotationSwap'
   */
  async getSwaps(req: Request, res: Response) {
    try {
      const swaps = await this.service.getSwaps(req.query);
      res.json(swaps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get swaps' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/swaps/{id}:
   *   get:
   *     summary: Get swap request by ID
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Swap request ID
   *     responses:
   *       200:
   *         description: Swap request details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RotationSwap'
   *       404:
   *         description: Swap request not found
   */
  async getSwapById(req: Request, res: Response) {
    try {
      const swap = await this.service.getSwapById(req.params.id);
      if (!swap) {
        return res.status(404).json({ error: 'Swap request not found' });
      }
      res.json(swap);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get swap' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/swaps:
   *   post:
   *     summary: Create a new swap request
   *     tags: [Calendar]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateSwapDto'
   *     responses:
   *       201:
   *         description: Swap request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RotationSwap'
   *       400:
   *         description: Invalid input data
   */
  async createSwap(req: Request, res: Response) {
    try {
      const swap = await this.service.createSwap(req.body as CreateSwapInput);
      res.status(201).json(swap);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create swap request' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/swaps/{id}:
   *   put:
   *     summary: Update swap request status
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Swap request ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateSwapDto'
   *     responses:
   *       200:
   *         description: Swap request updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RotationSwap'
   *       404:
   *         description: Swap request not found
   *       400:
   *         description: Invalid input data
   */
  async updateSwap(req: Request, res: Response) {
    try {
      const swap = await this.service.updateSwap(
        req.params.id,
        req.body as UpdateSwapInput
      );
      res.json(swap);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update swap request' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/swaps/{id}:
   *   delete:
   *     summary: Delete swap request
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Swap request ID
   *     responses:
   *       204:
   *         description: Swap request deleted successfully
   *       404:
   *         description: Swap request not found
   */
  async deleteSwap(req: Request, res: Response) {
    try {
      await this.service.deleteSwap(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete swap request' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/availability:
   *   get:
   *     summary: Get member availability
   *     tags: [Calendar]
   *     parameters:
   *       - in: query
   *         name: squadId
   *         schema:
   *           type: string
   *         description: Filter by squad ID
   *       - in: query
   *         name: memberId
   *         schema:
   *           type: string
   *         description: Filter by member ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [ACTIVE, INACTIVE]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of member availability
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SquadMember'
   */
  async getAvailability(req: Request, res: Response) {
    try {
      const availability = await this.service.getAvailability(req.query);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get availability' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/availability/{id}:
   *   put:
   *     summary: Update member availability
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Member ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE]
   *             required:
   *               - status
   *     responses:
   *       200:
   *         description: Member availability updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SquadMember'
   *       404:
   *         description: Member not found
   *       400:
   *         description: Invalid input data
   */
  async updateMemberAvailability(req: Request, res: Response) {
    try {
      const availability = await this.service.updateMemberAvailability(
        req.params.id,
        req.body as UpdateAvailabilityInput
      );
      res.json(availability);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update availability' });
      }
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/standup-hosting/{squadId}:
   *   get:
   *     summary: Get standup hosting schedule for a squad
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: squadId
   *         required: true
   *         schema:
   *           type: string
   *         description: Squad ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for filtering
   *     responses:
   *       200:
   *         description: Standup hosting schedule
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/StandupHosting'
   */
  async getStandupHostingSchedule(req: Request, res: Response) {
    try {
      const { squadId } = req.params;
      const { startDate, endDate } = req.query;

      // Get the current date
      const currentDate = new Date();
      
      // If no startDate provided, use start of current month
      const start = startDate 
        ? new Date(startDate as string) 
        : startOfMonth(currentDate);
      
      // If no endDate provided, use end of current month
      const end = endDate 
        ? new Date(endDate as string)
        : endOfMonth(currentDate);

      const hostings = await this.service.getStandupHostingSchedule(squadId, start, end);
      res.json(hostings);
    } catch (error) {
      console.error('Error fetching standup hosting schedule:', error);
      res.status(500).json({ error: 'Failed to get standup hosting schedule' });
    }
  }

  /**
   * @swagger
   * /api/v1/calendar/incident-rotation/{squadId}:
   *   get:
   *     summary: Get incident rotation schedule for a squad
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: squadId
   *         required: true
   *         schema:
   *           type: string
   *         description: Squad ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for filtering
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for filtering
   *     responses:
   *       200:
   *         description: Incident rotation schedule
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/IncidentRotation'
   */
  async getIncidentRotationSchedule(req: Request, res: Response) {
    try {
      const { squadId } = req.params;
      const { startDate, endDate } = req.query;

      // Get the current date
      const currentDate = new Date();
      
      // If no startDate provided, use start of current month
      const start = startDate 
        ? new Date(startDate as string) 
        : startOfMonth(currentDate);
      
      // If no endDate provided, use end of current month
      const end = endDate 
        ? new Date(endDate as string)
        : endOfMonth(currentDate);

      const rotations = await this.service.getIncidentRotationSchedule(squadId, start, end);
      res.json(rotations);
    } catch (error) {
      console.error('Error fetching incident rotation schedule:', error);
      res.status(500).json({ error: 'Failed to get incident rotation schedule' });
    }
  }

  async getMemberStandupHostingHistory(req: Request, res: Response) {
    try {
      const { memberId } = req.params;
      const { startDate, endDate } = req.query;

      const history = await this.service.getMemberStandupHostingHistory(
        memberId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(history);
    } catch (error) {
      console.error('Error fetching standup hosting history:', error);
      res.status(500).json({ error: 'Failed to get standup hosting history' });
    }
  }

  async getMemberIncidentRotationHistory(req: Request, res: Response) {
    try {
      const { memberId } = req.params;
      const { startDate, endDate } = req.query;

      const history = await this.service.getMemberIncidentRotationHistory(
        memberId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(history);
    } catch (error) {
      console.error('Error fetching incident rotation history:', error);
      res.status(500).json({ error: 'Failed to get incident rotation history' });
    }
  }
} 