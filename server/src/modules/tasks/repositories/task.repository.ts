import { PrismaClient, Task, TaskComment, TaskStatus, TaskPriority } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto, AddCommentDto } from '../types/task.types';

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
        assignedToId: data.assignedTo,
        createdById: data.createdBy,
        projectId: data.projectId,
        tags: data.tags || [],
        attachments: data.attachments || {},
      },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }

  async findAll(params: {
    projectId?: string;
    assignedTo?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ tasks: Task[]; total: number }> {
    const {
      projectId,
      assignedTo,
      status,
      priority,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const where = {
      ...(projectId && { projectId }),
      ...(assignedTo && { assignedToId: assignedTo }),
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignedTo: true,
          createdBy: true,
          project: true,
          comments: {
            include: {
              createdBy: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { tasks, total };
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
        ...(data.assignedTo && { assignedToId: data.assignedTo }),
        ...(data.projectId && { projectId: data.projectId }),
        ...(data.tags && { tags: data.tags }),
        ...(data.attachments && { attachments: data.attachments }),
      },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
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
        project: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: true,
        createdBy: true,
        project: true,
        comments: {
          include: {
            createdBy: true,
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
        project: true,
        comments: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }
} 