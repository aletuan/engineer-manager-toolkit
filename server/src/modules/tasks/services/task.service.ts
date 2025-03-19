import { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto, UpdateTaskStatusDto } from '../types/task.types';
import { AppError } from '../../../shared/errors/errorHandler';

interface GetTasksParams {
  featureId?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TaskService {
  constructor(private repository: TaskRepository) {}

  async createTask(data: CreateTaskDto & { createdBy: string }): Promise<Task> {
    return this.repository.create(data);
  }

  async getTasks(params: GetTasksParams): Promise<{ tasks: Task[]; total: number }> {
    return this.repository.findAll(params);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    return task;
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    return this.repository.update(id, data);
  }

  async deleteTask(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    return this.repository.delete(id);
  }

  async addComment(taskId: string, data: AddCommentDto & { createdBy: string }): Promise<Task> {
    const task = await this.repository.findById(taskId);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    await this.repository.addComment(taskId, data);
    return this.repository.findById(taskId) as Promise<Task>;
  }

  async updateTaskStatus(id: string, data: UpdateTaskStatusDto): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }
    return this.repository.updateStatus(id, data.status);
  }

  async getTasksByFeature(featureId: string): Promise<Task[]> {
    return this.repository.findByFeature(featureId);
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return this.repository.findByUser(userId);
  }
} 