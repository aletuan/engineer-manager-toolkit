import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.string().datetime(),
  featureId: z.string(),
  assignedToId: z.string(),
  createdById: z.string(),
  tags: z.array(z.string()).default([]),
  attachments: z.record(z.any()).default({}),
});

export const updateTaskSchema = createTaskSchema.partial();

export const addCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type AddCommentDto = z.infer<typeof addCommentSchema>;
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusSchema>;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  progress: number;
  dueDate: Date;
  featureId: string;
  assignedTo: {
    id: string;
    email: string;
    fullName: string;
  };
  createdBy: {
    id: string;
    email: string;
    fullName: string;
  };
  tags: string[];
  attachments: Record<string, any>;
  comments: {
    id: string;
    content: string;
    createdBy: {
      id: string;
      email: string;
    };
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 