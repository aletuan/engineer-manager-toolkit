import { CalendarRepository } from '../repositories/calendar.repository';
import { CreateRotationInput, UpdateRotationInput, CreateSwapInput, UpdateSwapInput, UpdateAvailabilityInput } from '../types/calendar.types';

export class CalendarService {
  constructor(private repository: CalendarRepository) {}

  // Rotation Methods
  async getRotations(query: {
    squadId?: string;
    memberId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return this.repository.findRotations(query);
  }

  async getRotationById(id: string) {
    return this.repository.findRotationById(id);
  }

  async createRotation(data: CreateRotationInput) {
    // Validate date range
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }

    // Check for conflicts
    const existingRotations = await this.repository.findRotations({
      squadId: data.squadId,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    if (existingRotations.length > 0) {
      throw new Error('Rotation period conflicts with existing rotations');
    }

    return this.repository.createRotation({
      ...data,
      startDate,
      endDate,
    });
  }

  async updateRotation(id: string, data: UpdateRotationInput) {
    const rotation = await this.repository.findRotationById(id);
    if (!rotation) {
      throw new Error('Rotation not found');
    }

    // Validate date range if provided
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }
    }

    // Check for conflicts if dates are updated
    if (data.startDate || data.endDate) {
      const existingRotations = await this.repository.findRotations({
        squadId: rotation.squadId,
        startDate: data.startDate || rotation.startDate.toISOString(),
        endDate: data.endDate || rotation.endDate.toISOString(),
      });

      if (existingRotations.some(r => r.id !== id)) {
        throw new Error('Rotation period conflicts with existing rotations');
      }
    }

    return this.repository.updateRotation(id, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });
  }

  async deleteRotation(id: string) {
    const rotation = await this.repository.findRotationById(id);
    if (!rotation) {
      throw new Error('Rotation not found');
    }

    return this.repository.deleteRotation(id);
  }

  // Swap Methods
  async getSwaps(query: {
    rotationId?: string;
    requesterId?: string;
    accepterId?: string;
    status?: string;
  }) {
    return this.repository.findSwaps(query);
  }

  async getSwapById(id: string) {
    return this.repository.findSwapById(id);
  }

  async createSwap(data: CreateSwapInput) {
    const rotation = await this.repository.findRotationById(data.rotationId);
    if (!rotation) {
      throw new Error('Rotation not found');
    }

    // Validate swap date is within rotation period
    const swapDate = new Date(data.swapDate);
    if (swapDate < rotation.startDate || swapDate > rotation.endDate) {
      throw new Error('Swap date must be within rotation period');
    }

    return this.repository.createSwap({
      ...data,
      swapDate,
    });
  }

  async updateSwap(id: string, data: UpdateSwapInput) {
    const swap = await this.repository.findSwapById(id);
    if (!swap) {
      throw new Error('Swap request not found');
    }

    return this.repository.updateSwap(id, data);
  }

  async deleteSwap(id: string) {
    const swap = await this.repository.findSwapById(id);
    if (!swap) {
      throw new Error('Swap request not found');
    }

    return this.repository.deleteSwap(id);
  }

  // Availability Methods
  async getAvailability(query: {
    squadId?: string;
    memberId?: string;
    status?: string;
  }) {
    return this.repository.findAvailability(query);
  }

  async updateMemberAvailability(id: string, data: UpdateAvailabilityInput) {
    return this.repository.updateMemberAvailability(id, data);
  }

  async getStandupHostingSchedule(squadId: string, startDate: Date, endDate: Date) {
    return this.repository.getStandupHostingSchedule(squadId, startDate, endDate);
  }

  async getIncidentRotationSchedule(squadId: string, startDate: Date, endDate: Date) {
    return this.repository.getIncidentRotationSchedule(squadId, startDate, endDate);
  }
} 