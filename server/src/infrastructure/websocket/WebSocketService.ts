import { injectable, inject } from 'inversify';
import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { TYPES } from '../../types';
import { Logger } from '../../core/logger/Logger';

@injectable()
export class WebSocketService {
  private io: SocketIOServer | null = null;
  
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  initialize(server: Server): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:4200',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      this.logger.info(`Client connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        this.logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  broadcast<T>(event: string, data: T): void {
    if (!this.io) {
      this.logger.warn('WebSocket server not initialized');
      return;
    }
    
    this.io.emit(event, data);
  }
}