import { MemberStatus } from '@prisma/client';

export interface Squad {
  id: string;
  name: string;
  code: string;
  description: string | null;
  hasIncidentRoster: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SquadMember {
  id: string;
  squadId: string;
  userId: string;
  pid: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  avatarUrl: string | null;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSquadDto {
  name: string;
  description?: string;
}

export interface UpdateSquadDto {
  name?: string;
  description?: string;
}

export interface AddMemberDto {
  userId: string;
  pid: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  avatarUrl?: string;
  status?: MemberStatus;
}

export interface UpdateMemberDto {
  fullName?: string;
  phone?: string;
  position?: string;
  avatarUrl?: string;
  status?: MemberStatus;
} 