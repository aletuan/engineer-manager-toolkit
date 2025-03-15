import { z } from 'zod';
import { MemberStatus } from '@prisma/client';

export const createSquadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const updateSquadSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  pid: z.string().min(1, 'PID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  position: z.string().min(1, 'Position is required'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  status: z.nativeEnum(MemberStatus).optional(),
});

export const updateMemberSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  position: z.string().min(1, 'Position is required').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  status: z.nativeEnum(MemberStatus).optional(),
});

export type CreateSquadInput = z.infer<typeof createSquadSchema>;
export type UpdateSquadInput = z.infer<typeof updateSquadSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>; 