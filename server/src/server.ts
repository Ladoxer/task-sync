import 'dotenv/config';
import { setupApp } from './app';
import { container } from './config/container';
import { TYPES } from './types';
import { Logger } from './core/logger/Logger';
import { DatabaseService } from './infrastructure/database/DatabaseService';

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    const logger = container.get<Logger>(TYPES.Logger);
    const dbService = container.get<DatabaseService>(TYPES.DatabaseService);
    
    // Connect to database
    logger.info('Connecting to MongoDB...');
    await dbService.connect();
    logger.info('Connected to MongoDB');
    
    // Setup and start the server
    const { app, server } = setupApp();
    
    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down server...');
      await dbService.disconnect();
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();