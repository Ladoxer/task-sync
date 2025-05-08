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
    const user = await this.getCollection().findOne({ email });
    if (!user) return null;

    return new User({
      ...user,
      id: user._id.toString(),
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.getCollection().findOne({ _id: new ObjectId(id) });
    if (!user) return null;

    return new User({
      ...user,
      id: user._id.toString(),
    });
  }

  async create(user: User): Promise<User> {
    const { id, ...userData } = user;

    const result = await this.getCollection().insertOne({
      ...userData,
    });
    return new User({
      ...user,
      id: result.insertedId.toString(),
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const { id: _, ...updateData } = userData;

    const result = await this.getCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result?.value) return null;

    return new User({
      ...result.value,
      id: result.value._id.toString(),
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.getCollection().deleteOne({
      _id: new ObjectId(id),
    });
    return result.deletedCount === 1;
  }
}
