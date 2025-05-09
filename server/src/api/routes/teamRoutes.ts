import { Router } from 'express';
import { container } from '../../config/container';
import { TYPES } from '../../types';
import { TeamService } from '../../domain/services/TeamService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ApplicationError } from '../../core/errors/ApplicationError';
import { TeamRole } from '../../domain/models/Team';

const router = Router();
const teamService = container.get<TeamService>(TYPES.TeamService);

// Get all teams for the current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teams = await teamService.getUserTeams(userId);
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
});

// Get a specific team
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    
    // This will throw if team doesn't exist or user isn't a member
    const team = await teamService.getTeamById(teamId);
    
    // Check if user is a member
    const isMember = team.members.some(m => m.userId === userId);
    if (!isMember) {
      throw new ApplicationError('You do not have access to this team', 403);
    }
    
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// Create a new team
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teamData = req.body;
    
    const team = await teamService.createTeam(teamData, userId);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
});

// Update an existing team
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    const teamData = req.body;
    
    const team = await teamService.updateTeam(teamId, teamData, userId);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// Delete a team
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    
    await teamService.deleteTeam(teamId, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Add a member to a team
router.post('/:id/members', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    const { email, role } = req.body;
    
    if (!email || !role) {
      throw new ApplicationError('Email and role are required', 400);
    }
    
    const validRoles = Object.values(TeamRole);
    if (!validRoles.includes(role)) {
      throw new ApplicationError(`Role must be one of: ${validRoles.join(', ')}`, 400);
    }
    
    const team = await teamService.addTeamMember(teamId, email, role, userId);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// Update a team member's role
router.put('/:id/members/:memberId', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user.id;
    const { role } = req.body;
    
    if (!role) {
      throw new ApplicationError('Role is required', 400);
    }
    
    const validRoles = Object.values(TeamRole);
    if (!validRoles.includes(role)) {
      throw new ApplicationError(`Role must be one of: ${validRoles.join(', ')}`, 400);
    }
    
    const team = await teamService.updateTeamMember(teamId, memberId, role, userId);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// Remove a member from a team
router.delete('/:id/members/:memberId', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const memberId = req.params.memberId;
    const userId = req.user.id;
    
    const team = await teamService.removeTeamMember(teamId, memberId, userId);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
});

// Leave a team
router.post('/:id/leave', authMiddleware, async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;
    
    await teamService.leaveTeam(teamId, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;