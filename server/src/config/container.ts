import { Container } from 'inversify';
import { TYPES } from '../types';

// Logger
import { Logger } from '../core/logger/Logger';

// Database
import { DatabaseService } from '../infrastructure/database/DatabaseService';
import { ITaskRepository } from '../domain/repositories/ITaskRepository';
import { MongoTaskRepository } from '../infrastructure/database/MongoTaskRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { MongoUserRepository } from '../infrastructure/database/MongoUserRepository';

// WebSocket
import { WebSocketService } from '../infrastructure/websocket/WebSocketService';

// Services
import { TaskService } from '../domain/services/TaskService';
import { AuthService } from '../domain/services/AuthService';

export const container = new Container();

// Configure the container
// Core
container.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();

// Infrastructure
container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<WebSocketService>(TYPES.WebSocketService).to(WebSocketService).inSingletonScope();

// Repositories
container.bind<ITaskRepository>(TYPES.TaskRepository).to(MongoTaskRepository).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(MongoUserRepository).inSingletonScope();

// Services
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

// Export the function
export const configureContainer = (): Container => {
  return container;
};