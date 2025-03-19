import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto, UpdateRoleDto, Role, RoleAssignment, RoleAssignmentDto } from '../types/role.types';
import { AppError } from '../../../shared/errors/errorHandler';

export class RoleService {
  constructor(private repository: RoleRepository) {}

  async createRole(data: CreateRoleDto): Promise<Role> {
    return this.repository.create(data);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.repository.findAll();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }
    return role;
  }

  async updateRole(id: string, data: UpdateRoleDto): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }
    return this.repository.update(id, data);
  }

  async deleteRole(id: string): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role) {
      throw new AppError(404, 'Role not found');
    }
    return this.repository.delete(id);
  }

  async assignRole(data: RoleAssignmentDto): Promise<RoleAssignment> {
    return this.repository.assignRole(data);
  }

  async removeRoleAssignment(id: string): Promise<RoleAssignment> {
    return this.repository.removeRoleAssignment(id);
  }

  async getMemberRoles(squadId: string, memberId: string): Promise<RoleAssignment[]> {
    return this.repository.getMemberRoles(squadId, memberId);
  }
} 