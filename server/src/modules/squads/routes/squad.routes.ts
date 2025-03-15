import { Router } from 'express';
import { SquadController } from '../controllers/squad.controller';
import {
  validateCreateSquad,
  validateUpdateSquad,
  validateAddMember,
  validateUpdateMember,
} from '../middleware/validateRequest';

export function createSquadRouter(controller: SquadController): Router {
  const router = Router();

  // Squad routes
  router.post('/', validateCreateSquad, controller.createSquad.bind(controller));
  router.get('/', controller.getAllSquads.bind(controller));
  router.get('/:id', controller.getSquad.bind(controller));
  router.put('/:id', validateUpdateSquad, controller.updateSquad.bind(controller));
  router.delete('/:id', controller.deleteSquad.bind(controller));

  // Squad member routes
  router.post('/:squadId/members', validateAddMember, controller.addMember.bind(controller));
  router.get('/:squadId/members', controller.getSquadMembers.bind(controller));
  router.put('/members/:id', validateUpdateMember, controller.updateMember.bind(controller));
  router.delete('/members/:id', controller.removeMember.bind(controller));

  return router;
} 