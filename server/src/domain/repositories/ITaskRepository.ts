import { Task } from '../models/Task';
import { ITask } from 'task-sync-shared';

export interface ITaskRepository {
  findAll(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<ITask>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  findByTeam(teamId: string): Promise<Task[]>;
  findByAssignee(assigneeId: string): Promise<Task[]>;
}