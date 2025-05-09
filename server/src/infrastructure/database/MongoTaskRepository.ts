import { injectable, inject } from "inversify";
import { Collection, ObjectId } from "mongodb";
import { TYPES } from "../../types";
import { Task } from "../../domain/models/Task";
import { ITask } from "task-sync-shared";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { DatabaseService } from "./DatabaseService";

@injectable()
export class MongoTaskRepository implements ITaskRepository {
  private collection: Collection | null = null;

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService
  ) {}

  private getCollection(): Collection {
    if (!this.collection) {
      this.collection = this.dbService.getCollection("tasks");
    }
    return this.collection;
  }

  async findAll(userId: string): Promise<Task[]> {
    const tasks = await this.getCollection().find({ userId }).toArray();
    return tasks.map(
      (task) =>
        new Task({
          ...task,
          id: task._id.toString(),
        })
    );
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const objectId = new ObjectId(id);
      const task = await this.getCollection().findOne({ _id: objectId });
      if (!task) return null;

      return new Task({
        ...task,
        id: task._id.toString(),
      });
    } catch (error) {
      console.error(`Error finding task by ID ${id}:`, error);
      return null;
    }
  }

  async create(task: Task): Promise<Task> {
    const { id, ...taskData } = task;
    const result = await this.getCollection().insertOne({
      ...taskData,
    });

    return new Task({
      ...task,
      id: result.insertedId.toString(),
    });
  }

  async update(id: string, taskData: Partial<ITask>): Promise<Task | null> {
    try {
      const { id: _, ...updateData } = taskData;
      const objectId = new ObjectId(id);

      const existingTask = await this.getCollection().findOne({ _id: objectId });
      
      if (!existingTask) {
        console.log(`Task with ID ${id} not found`);
        return null;
      }
      
      const updateResult = await this.getCollection().updateOne(
        { _id: objectId },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

      if (updateResult.modifiedCount === 0) {
        console.log(`No changes made to task ${id}`);
        return null;
      }
      
      const updatedTask = await this.getCollection().findOne({ _id: objectId });
      if (!updatedTask) {
        console.log(`Updated task with ID ${id} not found after update`);
        return null;
      }

      return new Task({
        ...updatedTask,
        id: updatedTask._id.toString(),
      });
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const result = await this.getCollection().deleteOne({
        _id: objectId,
      });
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      return false;
    }
  }

  async findByTeam(teamId: string): Promise<Task[]> {
    const tasks = await this.getCollection().find({ teamId }).toArray();
    return tasks.map(task => new Task({
      ...task,
      id: task._id.toString()
    }));
  }
  
  async findByAssignee(assigneeId: string): Promise<Task[]> {
    const tasks = await this.getCollection().find({ assignedTo: assigneeId }).toArray();
    return tasks.map(task => new Task({
      ...task,
      id: task._id.toString()
    }));
  }
}