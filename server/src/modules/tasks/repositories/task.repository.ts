import { PrismaClient, Task, TaskComment, TaskStatus, TaskPriority } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto } from '../types/task.types';

interface FindAllParams {
  featureId?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTaskDto & { createdBy: string }): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        dueDate: new Date(data.dueDate),
        featureId: data.featureId,
        assignedToId: data.assignedToId,
        createdById: data.createdBy,
        tags: data.tags,
        attachments: data.attachments,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(params: FindAllParams): Promise<{ tasks: Task[]; total: number }> {
    const { featureId, assignedTo, status, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(featureId && { featureId }),
      ...(assignedTo && { assignedToId: assignedTo }),
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.status && { status: data.status as TaskStatus }),
        ...(data.priority && { priority: data.priority as TaskPriority }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
        ...(data.featureId && { featureId: data.featureId }),
        ...(data.assignedToId && { assignedToId: data.assignedToId }),
        ...(data.tags && { tags: data.tags }),
        ...(data.attachments && { attachments: data.attachments }),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async addComment(taskId: string, data: AddCommentDto & { createdBy: string }): Promise<TaskComment> {
    return this.prisma.taskComment.create({
      data: {
        content: data.content,
        taskId,
        createdById: data.createdBy,
      },
      include: {
        createdBy: true,
      },
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignedTo: true,
        createdBy: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }

  async findByFeature(featureId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { featureId },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        assignedTo: true,
        createdBy: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }
} 