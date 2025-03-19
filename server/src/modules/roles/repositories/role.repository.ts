import { PrismaClient, Role as PrismaRole, RoleAssignment as PrismaRoleAssignment } from '@prisma/client';
import { CreateRoleDto, UpdateRoleDto, Role, RoleAssignment, RoleAssignmentDto } from '../types/role.types';

function mapPrismaRole(role: PrismaRole): Role {
  return {
    ...role,
    description: role.description ?? undefined,
  };
}

export class RoleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const role = await this.prisma.role.create({ data });
    return mapPrismaRole(role);
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map(mapPrismaRole);
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    return role ? mapPrismaRole(role) : null;
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role> {
    const role = await this.prisma.role.update({ where: { id }, data });
    return mapPrismaRole(role);
  }

  async delete(id: string): Promise<Role> {
    const role = await this.prisma.role.delete({ where: { id } });
    return mapPrismaRole(role);
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