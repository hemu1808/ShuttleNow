import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
      admin?: { id: string };
    }
  }
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export interface AdminRequest extends Request {
  admin?: { id: string };
}