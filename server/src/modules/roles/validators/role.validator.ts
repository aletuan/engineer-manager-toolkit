import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required').optional(),
});

export const roleAssignmentSchema = z.object({
  squadId: z.string().uuid('Invalid squad ID'),
  memberId: z.string().uuid('Invalid member ID'),
  roleId: z.string().uuid('Invalid role ID'),
  assignedBy: z.string().min(1, 'Assigned by is required'),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
export type RoleAssignmentDto = z.infer<typeof roleAssignmentSchema>; 