import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { validateRequest } from '../../../shared/middleware/validateRequest';
import { createRoleSchema, updateRoleSchema, roleAssignmentSchema } from '../validators/role.validator';

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - permissions
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *     UpdateRoleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *     RoleAssignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         squadId:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         roleId:
 *           type: string
 *           format: uuid
 *         assignedAt:
 *           type: string
 *           format: date-time
 *         assignedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export function createRoleRouter(controller: RoleController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/roles:
   *   post:
   *     summary: Create a new role
   *     tags: [Roles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateRoleDto'
   *     responses:
   *       201:
   *         description: Role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       400:
   *         description: Invalid request data
   */
  router.post('/', validateRequest(createRoleSchema), controller.createRole.bind(controller));

  /**
   * @swagger
   * /api/v1/roles:
   *   get:
   *     summary: Get all roles
   *     tags: [Roles]
   *     responses:
   *       200:
   *         description: List of roles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Role'
   */
  router.get('/', controller.getAllRoles.bind(controller));

  /**
   * @swagger
   * /api/v1/roles/{id}:
   *   get:
   *     summary: Get a role by ID
   *     tags: [Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Role details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       404:
   *         description: Role not found
   */
  router.get('/:id', controller.getRoleById.bind(controller));

  /**
   * @swagger
   * /api/v1/roles/{id}:
   *   put:
   *     summary: Update a role
   *     tags: [Roles]
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
   *             $ref: '#/components/schemas/UpdateRoleDto'
   *     responses:
   *       200:
   *         description: Role updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       404:
   *         description: Role not found
   *       400:
   *         description: Invalid request data
   */
  router.put('/:id', validateRequest(updateRoleSchema), controller.updateRole.bind(controller));

  /**
   * @swagger
   * /api/v1/roles/{id}:
   *   delete:
   *     summary: Delete a role
   *     tags: [Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Role deleted successfully
   *       404:
   *         description: Role not found
   */
  router.delete('/:id', controller.deleteRole.bind(controller));

  /**
   * @swagger
   * /api/v1/roles/assign:
   *   post:
   *     summary: Assign a role to a squad member
   *     tags: [Roles]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RoleAssignment'
   *     responses:
   *       201:
   *         description: Role assigned successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleAssignment'
   *       400:
   *         description: Invalid request data
   */
  router.post('/assign', validateRequest(roleAssignmentSchema), controller.assignRole.bind(controller));

  /**
   * @swagger
   * /api/v1/roles/assignments/{id}:
   *   delete:
   *     summary: Remove a role assignment
   *     tags: [Roles]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Role assignment removed successfully
   *       404:
   *         description: Role assignment not found
   */
  router.delete('/assignments/:id', controller.removeRoleAssignment.bind(controller));

  /**
   * @swagger
   * /api/v1/squads/{squadId}/members/{memberId}/roles:
   *   get:
   *     summary: Get all roles assigned to a squad member
   *     tags: [Roles]
   *     parameters:
   *       - in: path
   *         name: squadId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of role assignments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/RoleAssignment'
   */
  router.get('/squads/:squadId/members/:memberId/roles', controller.getMemberRoles.bind(controller));

  return router;
} 