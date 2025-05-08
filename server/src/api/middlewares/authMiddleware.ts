import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { AuthService } from '../../domain/services/AuthService';
import { ApplicationError } from '../../core/errors/ApplicationError';
import { container } from '../../config/container';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApplicationError('Authorization header is required', 401);
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new ApplicationError('Invalid authorization format', 401);
    }

    const authService = container.get<AuthService>(TYPES.AuthService);
    const decoded = authService.verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};