import { ITask, TaskStatus, TaskPriority } from 'task-sync-shared';

export class Task implements ITask {
  public id: string;
  public title: string;
  public description?: string;
  public status: TaskStatus;
  public priority: TaskPriority;
  public createdAt: Date;
  public updatedAt: Date;
  public userId: string;

  constructor(task: Partial<ITask>) {
    this.id = task.id || crypto.randomUUID();
    this.title = task.title || '';
    this.description = task.description;
    this.status = task.status || TaskStatus.TODO;
    this.priority = task.priority || TaskPriority.MEDIUM;
    this.createdAt = task.createdAt || new Date();
    this.updatedAt = task.updatedAt || new Date();
    this.userId = task.userId || '';
  }

  public update(data: Partial<ITask>): void {
    if (data.title) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.status) this.status = data.status;
    if (data.priority) this.priority = data.priority;
    this.updatedAt = new Date();
  }
}