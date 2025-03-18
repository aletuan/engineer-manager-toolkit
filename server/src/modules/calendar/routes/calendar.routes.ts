import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';

/**
 * @swagger
 * tags:
 *   name: Calendar
 *   description: Calendar management endpoints
 */

export function createCalendarRouter(controller: CalendarController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/calendar/rotations:
   *   get:
   *     summary: Get all rotations
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: List of rotations
   */
  router.get('/rotations', controller.getRotations.bind(controller));

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
   *     responses:
   *       200:
   *         description: Rotation details
   */
  router.get('/rotations/:id', controller.getRotationById.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/rotations:
   *   post:
   *     summary: Create a new rotation
   *     tags: [Calendar]
   *     responses:
   *       201:
   *         description: Rotation created successfully
   */
  router.post('/rotations', controller.createRotation.bind(controller));

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
   *     responses:
   *       200:
   *         description: Rotation updated successfully
   */
  router.put('/rotations/:id', controller.updateRotation.bind(controller));

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
   *     responses:
   *       204:
   *         description: Rotation deleted successfully
   */
  router.delete('/rotations/:id', controller.deleteRotation.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/swaps:
   *   get:
   *     summary: Get all swap requests
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: List of swap requests
   */
  router.get('/swaps', controller.getSwaps.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/swaps/{id}:
   *   get:
   *     summary: Get swap by ID
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Swap details
   */
  router.get('/swaps/:id', controller.getSwapById.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/swaps:
   *   post:
   *     summary: Create a new swap request
   *     tags: [Calendar]
   *     responses:
   *       201:
   *         description: Swap request created successfully
   */
  router.post('/swaps', controller.createSwap.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/swaps/{id}:
   *   put:
   *     summary: Update swap request
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Swap request updated successfully
   */
  router.put('/swaps/:id', controller.updateSwap.bind(controller));

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
   *     responses:
   *       204:
   *         description: Swap request deleted successfully
   */
  router.delete('/swaps/:id', controller.deleteSwap.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/availability:
   *   get:
   *     summary: Get member availability
   *     tags: [Calendar]
   *     responses:
   *       200:
   *         description: List of member availability
   */
  router.get('/availability', controller.getAvailability.bind(controller));

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
   *     responses:
   *       200:
   *         description: Member availability updated successfully
   */
  router.put('/availability/:id', controller.updateMemberAvailability.bind(controller));

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
   *     responses:
   *       200:
   *         description: Standup hosting schedule
   */
  router.get('/standup-hosting/:squadId', controller.getStandupHostingSchedule.bind(controller));

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
   *     responses:
   *       200:
   *         description: Incident rotation schedule
   */
  router.get('/incident-rotation/:squadId', controller.getIncidentRotationSchedule.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/standup-hosting/history/{memberId}:
   *   get:
   *     summary: Get standup hosting history for a member
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: string
   *         description: Member ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Optional start date for filtering (YYYY-MM-DD)
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Optional end date for filtering (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Member's standup hosting history
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/StandupHosting'
   */
  router.get('/standup-hosting/history/:memberId', controller.getMemberStandupHostingHistory.bind(controller));

  /**
   * @swagger
   * /api/v1/calendar/incident-rotation/history/{memberId}:
   *   get:
   *     summary: Get incident rotation history for a member
   *     tags: [Calendar]
   *     parameters:
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: string
   *         description: Member ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Optional start date for filtering (YYYY-MM-DD)
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Optional end date for filtering (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: Member's incident rotation history
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/IncidentRotation'
   */
  router.get('/incident-rotation/history/:memberId', controller.getMemberIncidentRotationHistory.bind(controller));

  return router;
}

export default createCalendarRouter; 