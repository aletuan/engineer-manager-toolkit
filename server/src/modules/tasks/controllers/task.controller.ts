import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto, UpdateTaskStatusDto } from '../types/task.types';

export class TaskController {
  constructor(private service: TaskService) {}

  async createTask(req: Request, res: Response): Promise<void> {
    const data: CreateTaskDto = req.body;
    const task = await this.service.createTask({
      ...data,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const { projectId, assignedTo, status, priority, page, limit, sortBy, sortOrder } = req.query;
    const tasks = await this.service.getTasks({
      projectId: projectId as string,
      assignedTo: assignedTo as string,
      status: status as string,
      priority: priority as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
    res.json(tasks);
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const task = await this.service.getTaskById(id);
    res.json(task);
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateTaskDto = req.body;
    const task = await this.service.updateTask(id, data);
    res.json(task);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.deleteTask(id);
    res.status(204).send();
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: AddCommentDto = req.body;
    const task = await this.service.addComment(id, {
      ...data,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateTaskStatusDto = req.body;
    const task = await this.service.updateTaskStatus(id, data);
    res.json(task);
  }

  async getTasksByProject(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const tasks = await this.service.getTasksByProject(projectId);
    res.json(tasks);
  }

  async getTasksByUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const tasks = await this.service.getTasksByUser(userId);
    res.json(tasks);
  }
} 