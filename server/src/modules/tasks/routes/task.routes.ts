import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validateRequest } from '../../../shared/middleware/validateRequest';
import {
  createTaskSchema,
  updateTaskSchema,
  addCommentSchema,
  updateTaskStatusSchema,
} from '../validators/task.validator';

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         assignedTo:
 *           type: string
 *           format: uuid
 *         createdBy:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               createdBy:
 *                 type: string
 *                 format: uuid
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTaskDto:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - dueDate
 *         - assignedTo
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         assignedTo:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *     UpdateTaskDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         assignedTo:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               type:
 *                 type: string
 *     AddCommentDto:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *     UpdateTaskStatusDto:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 */

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/v1/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskDto'
   *     responses:
   *       201:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       400:
   *         description: Invalid request data
   */
  router.post('/', validateRequest(createTaskSchema), controller.createTask.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks:
   *   get:
   *     summary: Get all tasks with filtering and pagination
   *     tags: [Tasks]
   *     parameters:
   *       - in: query
   *         name: projectId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: assignedTo
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE]
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: [LOW, MEDIUM, HIGH]
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           default: createdAt
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *     responses:
   *       200:
   *         description: List of tasks with pagination
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 tasks:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *                 total:
   *                   type: integer
   */
  router.get('/', controller.getTasks.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   get:
   *     summary: Get a task by ID
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Task details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   */
  router.get('/:id', controller.getTaskById.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
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
   *             $ref: '#/components/schemas/UpdateTaskDto'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   *       400:
   *         description: Invalid request data
   */
  router.put('/:id', validateRequest(updateTaskSchema), controller.updateTask.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Task deleted successfully
   *       404:
   *         description: Task not found
   */
  router.delete('/:id', controller.deleteTask.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/{id}/status:
   *   patch:
   *     summary: Update task status
   *     tags: [Tasks]
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
   *             $ref: '#/components/schemas/UpdateTaskStatusDto'
   *     responses:
   *       200:
   *         description: Task status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   *       400:
   *         description: Invalid request data
   */
  router.patch('/:id/status', validateRequest(updateTaskStatusSchema), controller.updateTaskStatus.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/{id}/comments:
   *   post:
   *     summary: Add a comment to a task
   *     tags: [Tasks]
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
   *             $ref: '#/components/schemas/AddCommentDto'
   *     responses:
   *       201:
   *         description: Comment added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Task'
   *       404:
   *         description: Task not found
   *       400:
   *         description: Invalid request data
   */
  router.post('/:id/comments', validateRequest(addCommentSchema), controller.addComment.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/project/{projectId}:
   *   get:
   *     summary: Get all tasks for a project
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of tasks for the project
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   */
  router.get('/project/:projectId', controller.getTasksByProject.bind(controller));

  /**
   * @swagger
   * /api/v1/tasks/user/{userId}:
   *   get:
   *     summary: Get all tasks assigned to a user
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: List of tasks assigned to the user
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   */
  router.get('/user/:userId', controller.getTasksByUser.bind(controller));

  return router;
} 