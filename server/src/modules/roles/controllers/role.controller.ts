import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto, RoleAssignmentDto } from '../types/role.types';

export class RoleController {
  constructor(private service: RoleService) {}

  async createRole(req: Request, res: Response): Promise<void> {
    const data: CreateRoleDto = req.body;
    const role = await this.service.createRole(data);
    res.status(201).json(role);
  }

  async getAllRoles(req: Request, res: Response): Promise<void> {
    const roles = await this.service.getAllRoles();
    res.json(roles);
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const role = await this.service.getRoleById(id);
    res.json(role);
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateRoleDto = req.body;
    const role = await this.service.updateRole(id, data);
    res.json(role);
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.deleteRole(id);
    res.status(204).send();
  }

  async assignRole(req: Request, res: Response): Promise<void> {
    const data: RoleAssignmentDto = req.body;
    const assignment = await this.service.assignRole(data);
    res.status(201).json(assignment);
  }

  async removeRoleAssignment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.removeRoleAssignment(id);
    res.status(204).send();
  }

  async getMemberRoles(req: Request, res: Response): Promise<void> {
    const { squadId, memberId } = req.params;
    const roles = await this.service.getMemberRoles(squadId, memberId);
    res.json(roles);
  }
} 