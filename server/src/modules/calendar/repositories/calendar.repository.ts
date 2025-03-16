import { PrismaClient } from '@prisma/client';
import { GetRotationsQuery, GetSwapsQuery, GetAvailabilityQuery } from '../types/calendar.types';

export class CalendarRepository {
  constructor(private prisma: PrismaClient) {}

  // Rotation Methods
  async findRotations(query: GetRotationsQuery) {
    return this.prisma.incidentRotation.findMany({
      where: {
        squadId: query.squadId,
        OR: [
          { primaryMemberId: query.memberId },
          { secondaryMemberId: query.memberId },
        ],
        startDate: query.startDate ? { gte: new Date(query.startDate) } : undefined,
        endDate: query.endDate ? { lte: new Date(query.endDate) } : undefined,
      },
      include: {
        squad: true,
        primaryMember: true,
        secondaryMember: true,
        swaps: true,
      },
    });
  }

  async findRotationById(id: string) {
    return this.prisma.incidentRotation.findUnique({
      where: { id },
      include: {
        squad: true,
        primaryMember: true,
        secondaryMember: true,
        swaps: true,
      },
    });
  }

  async createRotation(data: {
    squadId: string;
    primaryMemberId: string;
    secondaryMemberId: string;
    startDate: Date;
    endDate: Date;
    sprintNumber: number;
  }) {
    return this.prisma.incidentRotation.create({
      data,
      include: {
        squad: true,
        primaryMember: true,
        secondaryMember: true,
      },
    });
  }

  async updateRotation(id: string, data: {
    primaryMemberId?: string;
    secondaryMemberId?: string;
    startDate?: Date;
    endDate?: Date;
    sprintNumber?: number;
  }) {
    return this.prisma.incidentRotation.update({
      where: { id },
      data,
      include: {
        squad: true,
        primaryMember: true,
        secondaryMember: true,
      },
    });
  }

  async deleteRotation(id: string) {
    return this.prisma.incidentRotation.delete({
      where: { id },
    });
  }

  // Swap Methods
  async findSwaps(query: GetSwapsQuery) {
    return this.prisma.rotationSwap.findMany({
      where: {
        rotationId: query.rotationId,
        requesterId: query.requesterId,
        accepterId: query.accepterId,
        status: query.status,
      },
      include: {
        rotation: true,
        requester: true,
        accepter: true,
      },
    });
  }

  async findSwapById(id: string) {
    return this.prisma.rotationSwap.findUnique({
      where: { id },
      include: {
        rotation: true,
        requester: true,
        accepter: true,
      },
    });
  }

  async createSwap(data: {
    rotationId: string;
    requesterId: string;
    accepterId: string;
    swapDate: Date;
  }) {
    return this.prisma.rotationSwap.create({
      data,
      include: {
        rotation: true,
        requester: true,
        accepter: true,
      },
    });
  }

  async updateSwap(id: string, data: { status: string }) {
    return this.prisma.rotationSwap.update({
      where: { id },
      data,
      include: {
        rotation: true,
        requester: true,
        accepter: true,
      },
    });
  }

  async deleteSwap(id: string) {
    return this.prisma.rotationSwap.delete({
      where: { id },
    });
  }

  // Availability Methods
  async findAvailability(query: GetAvailabilityQuery) {
    return this.prisma.squadMember.findMany({
      where: {
        squadId: query.squadId,
        id: query.memberId,
        status: query.status,
      },
      include: {
        squad: true,
      },
    });
  }

  async updateMemberAvailability(id: string, data: { status: string }) {
    return this.prisma.squadMember.update({
      where: { id },
      data,
      include: {
        squad: true,
      },
    });
  }
} 