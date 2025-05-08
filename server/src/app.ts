import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketService } from './infrastructure/websocket/WebSocketService';
import { errorHandler } from './api/middlewares/errorHandler';
import { configureContainer } from './config/container';
import { TYPES } from './types';
import { Logger } from './core/logger/Logger';
import apiRoutes from './api/routes';

export const setupApp = (): { app: express.Application; server: any } => {
  // Create and configure IoC container
  const container = configureContainer();
  
  // Create express app
  const app = express();
  
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true
  }));
  
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // API routes
  app.use('/api', apiRoutes);
  
  // Error handling
  app.use(errorHandler);
  
  // Create HTTP server
  const server = createServer(app);
  
  // Initialize WebSocket service
  const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
  wsService.initialize(server);
  
  return { app, server };
};