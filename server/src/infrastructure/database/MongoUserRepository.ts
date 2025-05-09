import { injectable, inject } from "inversify";
import { Collection, ObjectId } from "mongodb";
import { TYPES } from "../../types";
import { User } from "../../domain/models/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { DatabaseService } from "./DatabaseService";

@injectable()
export class MongoUserRepository implements IUserRepository {
  private collection: Collection | null = null;

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService
  ) {}

  private getCollection(): Collection {
    if (!this.collection) {
      this.collection = this.dbService.getCollection("users");
    }
    return this.collection;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.getCollection().findOne({ email });
      if (!user) return null;

      return new User({
        ...user,
        id: user._id.toString(),
      });
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.getCollection().findOne({ _id: new ObjectId(id) });
      if (!user) return null;

      return new User({
        ...user,
        id: user._id.toString(),
      });
    } catch (error) {
      console.error(`Error finding user by ID ${id}:`, error);
      return null;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const { id, ...userData } = user;

      const result = await this.getCollection().insertOne({
        ...userData,
      });
      return new User({
        ...user,
        id: result.insertedId.toString(),
      });
    } catch (error) {
      console.error(`Error creating user:`, error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const { id: _, ...updateData } = userData;
      const objectId = new ObjectId(id);

      const existingUser = await this.getCollection().findOne({ _id: objectId });

      if (!existingUser) {
        console.log(`User with ID ${id} not found`);
        return null;
      }

      const updateResult = await this.getCollection().updateOne(
        { _id: objectId },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

      if (updateResult.modifiedCount === 0) {
        console.log(`No changes made to user ${id}`);
        return null;
      }

      const updatedUser = await this.getCollection().findOne({ _id: objectId });
      if (!updatedUser) {
        console.log(`Updated task with ID ${id} not found after update`);
        return null;
      }

      return new User({
        ...updatedUser,
        id: updatedUser._id.toString(),
      });
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.getCollection().deleteOne({
        _id: new ObjectId(id),
      });
      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}