import { SquadMember } from '../../squads/types/squad.types';

export interface RotationSwap {
  id: string;
  rotationId: string;
  requesterId: string;
  accepterId: string;
  swapDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requester?: SquadMember;
  accepter?: SquadMember;
} 