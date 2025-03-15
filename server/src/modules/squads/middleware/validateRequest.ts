import { Request, Response, NextFunction } from 'express';
import { createSquadSchema, updateSquadSchema, addMemberSchema, updateMemberSchema } from '../validators/squad.validator';

export const validateCreateSquad = (req: Request, res: Response, next: NextFunction) => {
  try {
    createSquadSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid request data', errors: error });
  }
};

export const validateUpdateSquad = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateSquadSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid request data', errors: error });
  }
};

export const validateAddMember = (req: Request, res: Response, next: NextFunction) => {
  try {
    addMemberSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid request data', errors: error });
  }
};

export const validateUpdateMember = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateMemberSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid request data', errors: error });
  }
}; 