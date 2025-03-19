import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()),
});

export const updateRoleSchema = createRoleSchema.partial();

export const roleAssignmentSchema = z.object({
  squadId: z.string(),
  memberId: z.string(),
  roleId: z.string(),
  assignedBy: z.string(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
export type RoleAssignmentDto = z.infer<typeof roleAssignmentSchema>;

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAssignment {
  id: string;
  squadId: string;
  memberId: string;
  roleId: string;
  assignedBy: string;
  createdAt: Date;
  updatedAt: Date;
} 