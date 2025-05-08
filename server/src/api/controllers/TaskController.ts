import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { TYPES } from '../../types';
import { TaskService } from '../../domain/services/TaskService';
import { WebSocketService } from '../../infrastructure/websocket/WebSocketService';
import { authMiddleware } from '../middlewares/authMiddleware';

@controller('/api/tasks')
export class TaskController {
  constructor(
    @inject(TYPES.TaskService) private taskService: TaskService,
    @inject(TYPES.WebSocketService) private wsService: WebSocketService
  ) {}

  @httpGet('/', authMiddleware)
  async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const tasks = await this.taskService.getAllTasks(userId);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  @httpGet('/:id', authMiddleware)
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  @httpPost('/', authMiddleware)
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const taskData = { ...req.body, userId };
      const task = await this.taskService.createTask(taskData);
      
      // Notify all connected clients about the new task
      this.wsService.broadcast('task:created', task);
      
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  @httpPut('/:id', authMiddleware)
  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.updateTask(id, req.body);
      
      // Notify all connected clients about the task update
      this.wsService.broadcast('task:updated', task);
      
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  @httpDelete('/:id', authMiddleware)
  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);
      
      // Notify all connected clients about the task deletion
      this.wsService.broadcast('task:deleted', { id });
      
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}