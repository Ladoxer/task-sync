export interface ITeam {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: TeamRole;
  joinedAt: Date;
}

export enum TeamRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export class Team implements ITeam {
  public id: string;
  public name: string;
  public description?: string;
  public ownerId: string;
  public members: TeamMember[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(team: Partial<ITeam>) {
    this.id = team.id || crypto.randomUUID();
    this.name = team.name || '';
    this.description = team.description;
    this.ownerId = team.ownerId || '';
    this.members = team.members || [];
    this.createdAt = team.createdAt || new Date();
    this.updatedAt = team.updatedAt || new Date();
  }
}