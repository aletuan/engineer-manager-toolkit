import { PrismaClient } from '@prisma/client';
import { GetRotationsQuery, GetSwapsQuery, GetAvailabilityQuery } from '../types/calendar.types';

export class CalendarRepository {
  constructor(private prisma: PrismaClient) {}

  // Rotation Methods
  async findRotations(query: GetRotationsQuery) {
    const where: any = {};
    
    if (query.squadId) {
      where.squadId = query.squadId;
    }
    
    if (query.memberId) {
      where.OR = [
        { primaryMemberId: query.memberId },
        { secondaryMemberId: query.memberId },
      ];
    }
    
    if (query.startDate) {
      where.startDate = { gte: new Date(query.startDate) };
    }
    
    if (query.endDate) {
      where.endDate = { lte: new Date(query.endDate) };
    }
    
    return this.prisma.incidentRotation.findMany({
      where,
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

  async updateMemberAvailability(id: string, data: any) {
    return this.prisma.squadMember.update({
      where: { id },
      data,
    });
  }

  async getStandupHostingSchedule(squadId: string, startDate: Date, endDate: Date) {
    return this.prisma.standupHosting.findMany({
      where: {
        squadId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        member: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async getIncidentRotationSchedule(squadId: string, startDate: Date, endDate: Date) {
    return this.prisma.incidentRotation.findMany({
      where: {
        squadId,
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
      include: {
        primaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        secondaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        swaps: {
          include: {
            requester: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
            accepter: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getMemberStandupHostingHistory(memberId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      memberId,
    };

    if (startDate) {
      where.date = {
        ...where.date,
        gte: startDate,
      };
    }

    if (endDate) {
      where.date = {
        ...where.date,
        lte: endDate,
      };
    }

    return this.prisma.standupHosting.findMany({
      where,
      include: {
        squad: true,
        member: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getMemberIncidentRotationHistory(memberId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      OR: [
        { primaryMemberId: memberId },
        { secondaryMemberId: memberId },
      ],
    };

    if (startDate) {
      where.startDate = {
        ...where.startDate,
        gte: startDate,
      };
    }

    if (endDate) {
      where.endDate = {
        ...where.endDate,
        lte: endDate,
      };
    }

    return this.prisma.incidentRotation.findMany({
      where,
      include: {
        squad: true,
        primaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        secondaryMember: {
          select: {
            id: true,
            fullName: true,
            email: true,
            position: true,
            avatarUrl: true,
          },
        },
        swaps: {
          include: {
            requester: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
            accepter: {
              select: {
                id: true,
                fullName: true,
                email: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
} 