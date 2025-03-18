import { Router } from 'express';
import { SquadController } from '../controllers/squad.controller';
import {
  validateCreateSquad,
  validateUpdateSquad,
  validateAddMember,
  validateUpdateMember,
} from '../middleware/validateRequest';

/**
 * @swagger
 * tags:
 *   name: Squads
 *   description: Squad management endpoints
 */

/**
 * @swagger
 * /api/v1/squads:
 *   post:
 *     summary: Create a new squad
 *     tags: [Squads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSquadDto'
 *     responses:
 *       201:
 *         description: Squad created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Squad'
 *       400:
 *         description: Invalid request data
 */
export function createSquadRouter(controller: SquadController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/squads:
   *   get:
   *     summary: Get all squads
   *     tags: [Squads]
   *     responses:
   *       200:
   *         description: List of squads
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Squad'
   */
  router.get('/', controller.getAllSquads.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{id}:
   *   get:
   *     summary: Get a squad by ID
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Squad details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Squad'
   *       404:
   *         description: Squad not found
   */
  router.get('/:id', controller.getSquad.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{id}:
   *   put:
   *     summary: Update a squad
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateSquadDto'
   *     responses:
   *       200:
   *         description: Squad updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Squad'
   *       404:
   *         description: Squad not found
   *       400:
   *         description: Invalid request data
   */
  router.put('/:id', validateUpdateSquad, controller.updateSquad.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{id}:
   *   delete:
   *     summary: Delete a squad
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Squad deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Squad'
   *       404:
   *         description: Squad not found
   */
  router.delete('/:id', controller.deleteSquad.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{squadId}/members:
   *   post:
   *     summary: Add a member to a squad
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: squadId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AddMemberDto'
   *     responses:
   *       201:
   *         description: Member added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SquadMember'
   *       404:
   *         description: Squad not found
   *       400:
   *         description: Invalid request data
   */
  router.post('/:squadId/members', validateAddMember, controller.addMember.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{squadId}/members:
   *   get:
   *     summary: Get all members of a squad
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: squadId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of squad members
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SquadMember'
   *       404:
   *         description: Squad not found
   */
  router.get('/:squadId/members', controller.getSquadMembers.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/members/{id}:
   *   put:
   *     summary: Update a squad member
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateMemberDto'
   *     responses:
   *       200:
   *         description: Member updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SquadMember'
   *       404:
   *         description: Member not found
   *       400:
   *         description: Invalid request data
   */
  router.put('/members/:id', validateUpdateMember, controller.updateMember.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/members/{id}:
   *   delete:
   *     summary: Remove a member from a squad
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Member removed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SquadMember'
   *       404:
   *         description: Member not found
   */
  router.delete('/members/:id', controller.removeMember.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/members/{id}/details:
   *   get:
   *     summary: Get detailed information of a squad member
   *     tags: [Squads]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: The ID of the squad member
   *     responses:
   *       200:
   *         description: Member details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                 pid:
   *                   type: string
   *                 fullName:
   *                   type: string
   *                 email:
   *                   type: string
   *                 phone:
   *                   type: string
   *                   nullable: true
   *                 position:
   *                   type: string
   *                   nullable: true
   *                 avatarUrl:
   *                   type: string
   *                   nullable: true
   *                 status:
   *                   type: string
   *                   enum: [ACTIVE, INACTIVE]
   *                 squad:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     name:
   *                       type: string
   *                     code:
   *                       type: string
   *                     hasIncidentRoster:
   *                       type: boolean
   *       404:
   *         description: Member not found
   */
  router.get('/members/:id/details', controller.getMemberById.bind(controller));

  return router;
} 