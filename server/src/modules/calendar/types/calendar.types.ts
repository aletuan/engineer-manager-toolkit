import { z } from 'zod';
import { MemberStatus } from '@prisma/client';
import { SquadMember } from '../../squads/types/squad.types';
import { RotationSwap } from './rotation-swap.types';

// Rotation Types
export const createRotationSchema = z.object({
  squadId: z.string().uuid(),
  primaryMemberId: z.string().uuid(),
  secondaryMemberId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  sprintNumber: z.number().int().positive(),
});

export const updateRotationSchema = createRotationSchema.partial();

export type CreateRotationInput = z.infer<typeof createRotationSchema>;
export type UpdateRotationInput = z.infer<typeof updateRotationSchema>;

// Swap Types
export const createSwapSchema = z.object({
  rotationId: z.string().uuid(),
  requesterId: z.string().uuid(),
  accepterId: z.string().uuid(),
  swapDate: z.string().datetime(),
});

export const updateSwapSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export type CreateSwapInput = z.infer<typeof createSwapSchema>;
export type UpdateSwapInput = z.infer<typeof updateSwapSchema>;

// Availability Types
export const updateAvailabilitySchema = z.object({
  status: z.nativeEnum(MemberStatus),
});

export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;

// Query Types
export const getRotationsQuerySchema = z.object({
  squadId: z.string().uuid().optional(),
  memberId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const getSwapsQuerySchema = z.object({
  rotationId: z.string().uuid().optional(),
  requesterId: z.string().uuid().optional(),
  accepterId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const getAvailabilityQuerySchema = z.object({
  squadId: z.string().uuid().optional(),
  memberId: z.string().uuid().optional(),
  status: z.nativeEnum(MemberStatus).optional(),
});

export type GetRotationsQuery = z.infer<typeof getRotationsQuerySchema>;
export type GetSwapsQuery = z.infer<typeof getSwapsQuerySchema>;
export type GetAvailabilityQuery = z.infer<typeof getAvailabilityQuerySchema>;

export interface IncidentRotation {
  id: string;
  squadId: string;
  primaryMemberId: string;
  secondaryMemberId: string;
  startDate: Date;
  endDate: Date;
  sprintNumber: number;
  isCompleted: boolean;
  createdAt: Date;
  primaryMember?: SquadMember;
  secondaryMember?: SquadMember;
  swaps?: RotationSwap[];
}

export interface StandupHosting {
  id: string;
  squadId: string;
  memberId: string;
  date: Date;
  status: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  member?: SquadMember;
} 