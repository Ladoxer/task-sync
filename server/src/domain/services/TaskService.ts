import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import { Task } from "../models/Task";
import { ITask, TaskStatus } from "task-sync-shared";
import { ITaskRepository } from "../repositories/ITaskRepository";
import { ApplicationError } from "../../core/errors/ApplicationError";
import { TeamService } from "./TeamService";

@injectable()
export class TaskService {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository,
    @inject(TYPES.TeamService) private teamService: TeamService,
  ) {}

  async getAllTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findAll(userId);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new ApplicationError("Task not found", 404);
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
      throw new ApplicationError("Task not found", 404);
    }
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new ApplicationError("Task not found", 404);
    }
  }

  async changeTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.updateTask(id, { status });
  }

  async getTeamTasks(teamId: string, userId: string): Promise<Task[]> {
    // First, check if user is a member of the team
    const team = await this.teamService.getTeamById(teamId);
    const isMember = team.members.some((m) => m.userId === userId);

    if (!isMember) {
      throw new ApplicationError("You do not have access to this team", 403);
    }

    return this.taskRepository.findByTeam(teamId);
  }

  // Create a task within a team
  async createTeamTask(
    taskData: Partial<ITask>,
    teamId: string,
    userId: string
  ): Promise<Task> {
    // First, check if user is a member of the team
    const team = await this.teamService.getTeamById(teamId);
    const isMember = team.members.some((m) => m.userId === userId);

    if (!isMember) {
      throw new ApplicationError("You do not have access to this team", 403);
    }

    const task = new Task({
      ...taskData,
      userId,
      teamId,
    });

    return this.taskRepository.create(task);
  }

  // Assign a task to a team member
  async assignTask(
    taskId: string,
    assigneeId: string,
    userId: string
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);

    // If it's a team task, verify both users are in the team
    if (task.teamId) {
      const team = await this.teamService.getTeamById(task.teamId);

      const assigner = team.members.find((m) => m.userId === userId);
      if (!assigner) {
        throw new ApplicationError("You do not have access to this team", 403);
      }

      const assignee = team.members.find((m) => m.userId === assigneeId);
      if (!assignee) {
        throw new ApplicationError(
          "Assignee is not a member of this team",
          400
        );
      }
    } else {
      // For personal tasks, only the owner can assign
      if (task.userId !== userId) {
        throw new ApplicationError(
          "You do not have permission to assign this task",
          403
        );
      }
    }

    return this.updateTask(taskId, { assignedTo: assigneeId });
  }

  // Get tasks assigned to a user
  async getAssignedTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findByAssignee(userId);
  }
}
