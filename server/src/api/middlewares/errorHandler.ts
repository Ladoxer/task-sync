import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from '../../core/errors/ApplicationError';
import { Logger } from '../../core/logger/Logger';
import { TYPES } from '../../types';
import { container } from '../../config/container';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const logger = container.get<Logger>(TYPES.Logger);
  
  if (error instanceof ApplicationError) {
    logger.error(`${error.statusCode} - ${error.message}`);
    res.status(error.statusCode).json({
      error: {
        message: error.message
      }
    });
    return;
  }
  
  logger.error('Unhandled error', error);
  logger.error('Unhandled error', {
    name: error.name, 
    message: error.message,
    stack: error.stack
  });
  res.status(500).json({
    error: {
      message: 'Internal server error'
    }
  });
};