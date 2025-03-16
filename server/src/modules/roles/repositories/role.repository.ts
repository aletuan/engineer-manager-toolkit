import { PrismaClient } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto, Role, RoleAssignment } from '../types/role.types';

export class RoleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignRole(data: RoleAssignmentDto): Promise<RoleAssignment> {
    return this.prisma.roleAssignment.create({
      data,
    });
  }

  async removeRoleAssignment(id: string): Promise<RoleAssignment> {
    return this.prisma.roleAssignment.delete({
      where: { id },
    });
  }

  async getMemberRoles(squadId: string, memberId: string): Promise<RoleAssignment[]> {
    return this.prisma.roleAssignment.findMany({
      where: {
        squadId,
        memberId,
      },
      include: {
        role: true,
      },
    });
  }
} 