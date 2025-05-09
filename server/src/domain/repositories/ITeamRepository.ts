import { Team } from '../models/Team';

export interface ITeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  findByMember(userId: string): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(id: string, team: Partial<Team>): Promise<Team | null>;
  delete(id: string): Promise<boolean>;
}