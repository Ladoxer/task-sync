import { injectable, inject } from "inversify";
import { Collection, ObjectId } from "mongodb";
import { TYPES } from "../../types";
import { Team } from "../../domain/models/Team";
import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { DatabaseService } from "./DatabaseService";

@injectable()
export class MongoTeamRepository implements ITeamRepository {
  private collection: Collection | null = null;

  constructor(
    @inject(TYPES.DatabaseService) private dbService: DatabaseService
  ) {}

  private getCollection(): Collection {
    if (!this.collection) {
      this.collection = this.dbService.getCollection("teams");
    }
    return this.collection;
  }

  async findAll(): Promise<Team[]> {
    const teams = await this.getCollection().find().toArray();
    return teams.map(
      (team) =>
        new Team({
          ...team,
          id: team._id.toString(),
        })
    );
  }

  async findById(id: string): Promise<Team | null> {
    try {
      const team = await this.getCollection().findOne({
        _id: new ObjectId(id),
      });

      if (!team) return null;

      return new Team({
        ...team,
        id: team._id.toString(),
      });
    } catch (error) {
      console.error(`Error finding team by ID: ${id}`, error);
      return null;
    }
  }

  async findByMember(userId: string): Promise<Team[]> {
    const teams = await this.getCollection()
      .find({
        "members.userId": userId,
      })
      .toArray();

    return teams.map(
      (team) =>
        new Team({
          ...team,
          id: team._id.toString(),
        })
    );
  }

  async create(team: Team): Promise<Team> {
    const { id, ...teamData } = team;

    const result = await this.getCollection().insertOne({
      ...teamData,
    });

    return new Team({
      ...team,
      id: result.insertedId.toString(),
    });
  }

  async update(id: string, teamData: Partial<Team>): Promise<Team | null> {
    try {
      const { id: _, ...updateData } = teamData;
      const objectId = new ObjectId(id);

      const existingTeam = await this.getCollection().findOne({
        _id: objectId,
      });

      if (!existingTeam) {
        console.log(`Team with ID ${id} not found`);
        return null;
      }

      // Ensure updatedAt is set
      if (!updateData.updatedAt) {
        updateData.updatedAt = new Date();
      }

      const updateResult = await this.getCollection().updateOne(
        { _id: objectId },
        { $set: { ...updateData } }
      );

      if (updateResult.modifiedCount === 0) {
        console.log(`No changes made to Team ${id}`);
        return null;
      }

      const updatedTeam = await this.getCollection().findOne({ _id: objectId });
      if (!updatedTeam) {
        console.log(`Updated team with ID ${id} not found after update`);
        return null;
      }

      return new Team({
        ...updatedTeam,
        id: updatedTeam._id.toString(),
      });
    } catch (error) {
      console.error(`Error updating team: ${id}`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.getCollection().deleteOne({
        _id: new ObjectId(id),
      });

      return result.deletedCount === 1;
    } catch (error) {
      console.error(`Error deleting team: ${id}`, error);
      return false;
    }
  }
}
