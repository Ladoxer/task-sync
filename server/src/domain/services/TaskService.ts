import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Task } from '../models/Task';
import { ITask, TaskStatus } from 'task-sync-shared';
import { ITaskRepository } from '../repositories/ITaskRepository';
import { ApplicationError } from '../../core/errors/ApplicationError';

@injectable()
export class TaskService {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository
  ) {}

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findAll(userId);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new ApplicationError('Task not found', 404);
    }
    return task;
  }

  async createTask(taskData: Partial<ITask>): Promise<Task> {
    const task = new Task(taskData);
    return this.taskRepository.create(task);
  }

  async updateTask(id: string, taskData: Partial<ITask>): Promise<Task> {
    const updatedTask = await this.taskRepository.update(id, taskData);
    if (!updatedTask) {
      throw new ApplicationError('Task not found', 404);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new ApplicationError('Task not found', 404);
    }
  }

  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }
}