import { TaskService } from './TaskService';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../models/Task';
import { TaskStatus, TaskPriority } from 'task-sync-shared';
import { ApplicationError } from '../../core/errors/ApplicationError';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  const mockUserId = 'user-123';
  const mockTask: Task = new Task({
    id: 'task-123',
    title: 'Test Task',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<ITaskRepository>;

    taskService = new TaskService(mockTaskRepository);
  });

  describe('getAllTasks', () => {
    it('should return all tasks for a user', async () => {
      mockTaskRepository.findAll.mockResolvedValue([mockTask]);
      
      const result = await taskService.getAllTasks(mockUserId);
      
      expect(result).toEqual([mockTask]);
      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      
      const result = await taskService.getTaskById('task-123');
      
      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith('task-123');
    });

    it('should throw an error when task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);
      
      await expect(taskService.getTaskById('task-123')).rejects.toThrow(
        new ApplicationError('Task not found', 404)
      );
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const taskData = {
        title: 'New Task',
        userId: mockUserId
      };
      
      mockTaskRepository.create.mockImplementation(async (task) => task);
      
      const result = await taskService.createTask(taskData);
      
      expect(result.title).toEqual(taskData.title);
      expect(result.userId).toEqual(taskData.userId);
      expect(mockTaskRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update and return a task when found', async () => {
      const updateData = { title: 'Updated Task' };
      const updatedTask = new Task({
        ...mockTask,
        ...updateData
      });
      
      mockTaskRepository.update.mockResolvedValue(updatedTask);
      
      const result = await taskService.updateTask('task-123', updateData);
      
      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.update).toHaveBeenCalledWith('task-123', updateData);
    });

    it('should throw an error when task not found', async () => {
      mockTaskRepository.update.mockResolvedValue(null);
      
      await expect(taskService.updateTask('task-123', { title: 'Updated' })).rejects.toThrow(
        new ApplicationError('Task not found', 404)
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task when found', async () => {
      mockTaskRepository.delete.mockResolvedValue(true);
      
      await taskService.deleteTask('task-123');
      
      expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-123');
    });

    it('should throw an error when task not found', async () => {
      mockTaskRepository.delete.mockResolvedValue(false);
      
      await expect(taskService.deleteTask('task-123')).rejects.toThrow(
        new ApplicationError('Task not found', 404)
      );
    });
  });
});