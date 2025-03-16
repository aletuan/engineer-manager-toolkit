import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().datetime('Invalid date format'),
  assignedTo: z.string().uuid('Invalid user ID'),
  projectId: z.string().uuid('Invalid project ID'),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url('Invalid URL'),
    type: z.string(),
  })).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime('Invalid date format').optional(),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
  projectId: z.string().uuid('Invalid project ID').optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().url('Invalid URL'),
    type: z.string(),
  })).optional(),
});

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
  dueDate: Date;
  assignedTo: string;
  createdBy: string;
  projectId: string;
  tags: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  comments: {
    content: string;
    createdBy: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 