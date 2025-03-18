import { Request, Response } from 'express';
import { SquadService } from '../services/squad.service';
import { CreateSquadDto, UpdateSquadDto, AddMemberDto, UpdateMemberDto } from '../types/squad.types';

export class SquadController {
  constructor(private service: SquadService) {}

  async createSquad(req: Request, res: Response) {
    const data = req.body as CreateSquadDto;
    const squad = await this.service.createSquad(data);
    res.status(201).json(squad);
  }

  async getSquad(req: Request, res: Response) {
    const { id } = req.params;
    const squad = await this.service.getSquad(id);
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    res.json(squad);
  }

  async getAllSquads(req: Request, res: Response) {
    const squads = await this.service.getAllSquads();
    res.json(squads);
  }

  async updateSquad(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateSquadDto;
    try {
      const squad = await this.service.updateSquad(id, data);
      res.json(squad);
    } catch (error) {
      if (error instanceof Error && error.message === 'Squad not found') {
        return res.status(404).json({ message: 'Squad not found' });
      }
      throw error;
    }
  }

  async deleteSquad(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const squad = await this.service.deleteSquad(id);
      res.json(squad);
    } catch (error) {
      if (error instanceof Error && error.message === 'Squad not found') {
        return res.status(404).json({ message: 'Squad not found' });
      }
      throw error;
    }
  }

  async addMember(req: Request, res: Response) {
    const { squadId } = req.params;
    const data = req.body as AddMemberDto;
    try {
      const member = await this.service.addMember(squadId, data);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof Error && error.message === 'Squad not found') {
        return res.status(404).json({ message: 'Squad not found' });
      }
      throw error;
    }
  }

  async updateMember(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateMemberDto;
    try {
      const member = await this.service.updateMember(id, data);
      res.json(member);
    } catch (error) {
      if (error instanceof Error && error.message === 'Member not found') {
        return res.status(404).json({ message: 'Member not found' });
      }
      throw error;
    }
  }

  async removeMember(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const member = await this.service.removeMember(id);
      res.json(member);
    } catch (error) {
      if (error instanceof Error && error.message === 'Member not found') {
        return res.status(404).json({ message: 'Member not found' });
      }
      throw error;
    }
  }

  async getSquadMembers(req: Request, res: Response) {
    const { squadId } = req.params;
    try {
      const members = await this.service.getSquadMembers(squadId);
      res.json(members);
    } catch (error) {
      if (error instanceof Error && error.message === 'Squad not found') {
        return res.status(404).json({ message: 'Squad not found' });
      }
      throw error;
    }
  }

  async getMemberById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const member = await this.service.getMemberById(id);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      res.json(member);
    } catch (error) {
      if (error instanceof Error && error.message === 'Member not found') {
        return res.status(404).json({ message: 'Member not found' });
      }
      throw error;
    }
  }
} 