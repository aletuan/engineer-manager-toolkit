import { Squad, SquadMember } from '@prisma/client';
import { SquadRepository } from '../repositories/squad.repository';
import { CreateSquadDto, UpdateSquadDto, AddMemberDto, UpdateMemberDto } from '../types/squad.types';

export class SquadService {
  constructor(private repository: SquadRepository) {}

  async createSquad(data: CreateSquadDto): Promise<Squad> {
    return this.repository.create(data);
  }

  async getSquad(id: string): Promise<Squad | null> {
    return this.repository.findById(id);
  }

  async getAllSquads(): Promise<Squad[]> {
    return this.repository.findAll();
  }

  async updateSquad(id: string, data: UpdateSquadDto): Promise<Squad> {
    const squad = await this.repository.findById(id);
    if (!squad) {
      throw new Error('Squad not found');
    }
    return this.repository.update(id, data);
  }

  async deleteSquad(id: string): Promise<Squad> {
    const squad = await this.repository.findById(id);
    if (!squad) {
      throw new Error('Squad not found');
    }
    return this.repository.delete(id);
  }

  async addMember(squadId: string, data: AddMemberDto): Promise<SquadMember> {
    const squad = await this.repository.findById(squadId);
    if (!squad) {
      throw new Error('Squad not found');
    }
    return this.repository.addMember(squadId, data);
  }

  async updateMember(id: string, data: UpdateMemberDto): Promise<SquadMember> {
    const member = await this.repository.findMemberById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    return this.repository.updateMember(id, data);
  }

  async removeMember(id: string): Promise<SquadMember> {
    const member = await this.repository.findMemberById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    return this.repository.removeMember(id);
  }

  async getSquadMembers(squadId: string): Promise<SquadMember[]> {
    const squad = await this.repository.findById(squadId);
    if (!squad) {
      throw new Error('Squad not found');
    }
    return this.repository.findSquadMembers(squadId);
  }

  async getMemberById(id: string): Promise<SquadMember | null> {
    const member = await this.repository.findMemberById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }
} 