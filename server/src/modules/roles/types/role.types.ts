export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleAssignmentDto {
  squadId: string;
  memberId: string;
  roleId: string;
  assignedBy: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleAssignment {
  id: string;
  squadId: string;
  memberId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy: string;
  createdAt: Date;
  updatedAt: Date;
} 