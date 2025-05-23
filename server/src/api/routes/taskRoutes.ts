import { Router } from 'express';
import { container } from '../../config/container';
import { TYPES } from '../../types';
import { TaskService } from '../../domain/services/TaskService';
import { WebSocketService } from '../../infrastructure/websocket/WebSocketService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ApplicationError } from '../../core/errors/ApplicationError';

const router = Router();

// We'll get services from the container when routes are accessed, not when the module is loaded
// This ensures database connection is already established

// Get all tasks
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const taskService = container.get<TaskService>(TYPES.TaskService);
    const userId = req.user.id;
    const tasks = await taskService.getAllTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get task by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const taskService = container.get<TaskService>(TYPES.TaskService);
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Create task
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const taskService = container.get<TaskService>(TYPES.TaskService);
    const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
    const userId = req.user.id;
    const taskData = { ...req.body, userId };
    const task = await taskService.createTask(taskData);
    
    // Notify all connected clients about the new task
    wsService.broadcast('task:created', task);
    
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const taskService = container.get<TaskService>(TYPES.TaskService);
    const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
    const { id } = req.params;
    const task = await taskService.updateTask(id, req.body);
    
    // Notify all connected clients about the task update
    wsService.broadcast('task:updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const taskService = container.get<TaskService>(TYPES.TaskService);
    const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
    const { id } = req.params;
    await taskService.deleteTask(id);
    
    // Notify all connected clients about the task deletion
    wsService.broadcast('task:deleted', { id });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get('/team/:teamId', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user.id;
    const taskService = container.get<TaskService>(TYPES.TaskService);
    
    const tasks = await taskService.getTeamTasks(teamId, userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// Create a task within a team
router.post('/team/:teamId', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user.id;
    const taskData = req.body;
    const taskService = container.get<TaskService>(TYPES.TaskService);
    
    const task = await taskService.createTeamTask(taskData, teamId, userId);
    
    // Notify all connected clients about the new task
    const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
    wsService.broadcast('task:created', task);
    
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// Assign a task to a team member
router.post('/:id/assign', authMiddleware, async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { assigneeId } = req.body;
    const taskService = container.get<TaskService>(TYPES.TaskService);
    
    if (!assigneeId) {
      throw new ApplicationError('Assignee ID is required', 400);
    }
    
    const task = await taskService.assignTask(taskId, assigneeId, userId);
    
    // Notify all connected clients about the task update
    const wsService = container.get<WebSocketService>(TYPES.WebSocketService);
    wsService.broadcast('task:updated', task);
    
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Get tasks assigned to the current user
router.get('/assigned', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskService = container.get<TaskService>(TYPES.TaskService);
    
    const tasks = await taskService.getAssignedTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

export default router;