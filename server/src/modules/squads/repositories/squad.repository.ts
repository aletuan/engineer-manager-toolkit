import { PrismaClient, Squad, SquadMember } from '@prisma/client';
import { CreateSquadDto, UpdateSquadDto, AddMemberDto, UpdateMemberDto } from '../types/squad.types';

export class SquadRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateSquadDto): Promise<Squad> {
    return this.prisma.squad.create({
      data: {
        ...data,
        code: this.generateSquadCode(data.name),
      },
    });
  }

  async findById(id: string): Promise<Squad | null> {
    return this.prisma.squad.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Squad[]> {
    return this.prisma.squad.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        hasIncidentRoster: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateSquadDto): Promise<Squad> {
    return this.prisma.squad.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Squad> {
    return this.prisma.squad.delete({
      where: { id },
    });
  }

  async addMember(squadId: string, data: AddMemberDto): Promise<SquadMember> {
    return this.prisma.squadMember.create({
      data: {
        ...data,
        squadId,
      },
    });
  }

  async updateMember(id: string, data: UpdateMemberDto): Promise<SquadMember> {
    return this.prisma.squadMember.update({
      where: { id },
      data,
    });
  }

  async removeMember(id: string): Promise<SquadMember> {
    return this.prisma.squadMember.delete({
      where: { id },
    });
  }

  async findMemberById(id: string): Promise<SquadMember | null> {
    return this.prisma.squadMember.findUnique({
      where: { id },
      include: {
        squad: {
          select: {
            id: true,
            name: true,
            code: true,
            hasIncidentRoster: true
          }
        }
      }
    });
  }

  async findSquadMembers(squadId: string): Promise<SquadMember[]> {
    return this.prisma.squadMember.findMany({
      where: { squadId },
    });
  }

  private generateSquadCode(name: string): string {
    const prefix = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${timestamp}`;
  }
} 