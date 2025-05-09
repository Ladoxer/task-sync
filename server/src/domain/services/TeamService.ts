import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Team, TeamMember, TeamRole } from '../models/Team';
import { ITeamRepository } from '../repositories/ITeamRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { ApplicationError } from '../../core/errors/ApplicationError';

@injectable()
export class TeamService {
  constructor(
    @inject(TYPES.TeamRepository) private teamRepository: ITeamRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async createTeam(teamData: Partial<Team>, userId: string): Promise<Team> {
    const team = new Team({
      ...teamData,
      ownerId: userId,
      members: [
        {
          userId,
          role: TeamRole.OWNER,
          joinedAt: new Date()
        }
      ]
    });
    
    return this.teamRepository.create(team);
  }

  async getTeamById(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new ApplicationError('Team not found', 404);
    }
    
    return team;
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return this.teamRepository.findByMember(userId);
  }

  async updateTeam(
    id: string, 
    teamData: Partial<Team>, 
    userId: string
  ): Promise<Team> {
    const team = await this.getTeamById(id);
    
    // Check if user is allowed to update the team
    const member = team.members.find(m => m.userId === userId);
    if (!member || (member.role !== TeamRole.OWNER && member.role !== TeamRole.ADMIN)) {
      throw new ApplicationError('You do not have permission to update this team', 403);
    }
    
    // Don't allow changing owner directly through this method
    const { ownerId, members, ...updateData } = teamData;
    
    const updatedTeam = await this.teamRepository.update(id, {
      ...updateData,
      updatedAt: new Date()
    });
    
    if (!updatedTeam) {
      throw new ApplicationError('Failed to update team', 500);
    }
    
    return updatedTeam;
  }

  async deleteTeam(id: string, userId: string): Promise<void> {
    const team = await this.getTeamById(id);
    
    // Only the owner can delete the team
    if (team.ownerId !== userId) {
      throw new ApplicationError('Only the team owner can delete the team', 403);
    }
    
    const deleted = await this.teamRepository.delete(id);
    if (!deleted) {
      throw new ApplicationError('Failed to delete team', 500);
    }
  }

  async addTeamMember(
    teamId: string, 
    email: string, 
    role: TeamRole,
    requestingUserId: string
  ): Promise<Team> {
    const team = await this.getTeamById(teamId);
    
    // Check if requesting user has permission
    const requester = team.members.find(m => m.userId === requestingUserId);
    if (!requester || (requester.role !== TeamRole.OWNER && requester.role !== TeamRole.ADMIN)) {
      throw new ApplicationError('You do not have permission to add members', 403);
    }
    
    // Cannot assign a role higher than your own
    if (requester.role !== TeamRole.OWNER && role === TeamRole.ADMIN) {
      throw new ApplicationError('You cannot assign a role higher than your own', 403);
    }
    
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApplicationError('User not found', 404);
    }
    
    // Check if user is already a member
    if (team.members.some(m => m.userId === user.id)) {
      throw new ApplicationError('User is already a member of this team', 400);
    }
    
    // Add user to team
    team.members.push({
      userId: user.id,
      role,
      joinedAt: new Date()
    });
    
    const updatedTeam = await this.teamRepository.update(teamId, {
      members: team.members,
      updatedAt: new Date()
    });
    
    if (!updatedTeam) {
      throw new ApplicationError('Failed to add member to team', 500);
    }
    
    return updatedTeam;
  }

  async updateTeamMember(
    teamId: string,
    memberId: string,
    role: TeamRole,
    requestingUserId: string
  ): Promise<Team> {
    const team = await this.getTeamById(teamId);
    
    // Check if requesting user has permission
    const requester = team.members.find(m => m.userId === requestingUserId);
    if (!requester || (requester.role !== TeamRole.OWNER && requester.role !== TeamRole.ADMIN)) {
      throw new ApplicationError('You do not have permission to update members', 403);
    }
    
    // Cannot update the owner's role
    if (memberId === team.ownerId) {
      throw new ApplicationError('Cannot change the role of the team owner', 403);
    }
    
    // Cannot assign a role higher than your own
    if (requester.role !== TeamRole.OWNER && role === TeamRole.ADMIN) {
      throw new ApplicationError('You cannot assign a role higher than your own', 403);
    }
    
    // Find the member to update
    const memberIndex = team.members.findIndex(m => m.userId === memberId);
    if (memberIndex === -1) {
      throw new ApplicationError('Member not found in team', 404);
    }
    
    // Update the member's role
    team.members[memberIndex].role = role;
    
    const updatedTeam = await this.teamRepository.update(teamId, {
      members: team.members,
      updatedAt: new Date()
    });
    
    if (!updatedTeam) {
      throw new ApplicationError('Failed to update team member', 500);
    }
    
    return updatedTeam;
  }

  async removeTeamMember(
    teamId: string,
    memberId: string,
    requestingUserId: string
  ): Promise<Team> {
    const team = await this.getTeamById(teamId);
    
    // Cannot remove the team owner
    if (memberId === team.ownerId) {
      throw new ApplicationError('Cannot remove the team owner', 403);
    }
    
    // Check if requesting user has permission
    const requester = team.members.find(m => m.userId === requestingUserId);
    if (!requester || (requester.role !== TeamRole.OWNER && requester.role !== TeamRole.ADMIN)) {
      throw new ApplicationError('You do not have permission to remove members', 403);
    }
    
    // An admin cannot remove another admin
    const memberToRemove = team.members.find(m => m.userId === memberId);
    if (!memberToRemove) {
      throw new ApplicationError('Member not found in team', 404);
    }
    
    if (requester.role === TeamRole.ADMIN && memberToRemove.role === TeamRole.ADMIN) {
      throw new ApplicationError('Admins cannot remove other admins', 403);
    }
    
    // Remove the member
    const updatedMembers = team.members.filter(m => m.userId !== memberId);
    
    const updatedTeam = await this.teamRepository.update(teamId, {
      members: updatedMembers,
      updatedAt: new Date()
    });
    
    if (!updatedTeam) {
      throw new ApplicationError('Failed to remove team member', 500);
    }
    
    return updatedTeam;
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.getTeamById(teamId);
    
    // The owner cannot leave the team, they must delete it or transfer ownership
    if (team.ownerId === userId) {
      throw new ApplicationError('The team owner cannot leave the team', 403);
    }
    
    // Check if user is a member
    const memberIndex = team.members.findIndex(m => m.userId === userId);
    if (memberIndex === -1) {
      throw new ApplicationError('You are not a member of this team', 404);
    }
    
    // Remove the member
    const updatedMembers = team.members.filter(m => m.userId !== userId);
    
    const updated = await this.teamRepository.update(teamId, {
      members: updatedMembers,
      updatedAt: new Date()
    });
    
    if (!updated) {
      throw new ApplicationError('Failed to leave team', 500);
    }
  }
}