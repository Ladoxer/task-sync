import { createAction, props } from '@ngrx/store';
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  AddMemberRequest, 
  UpdateMemberRequest 
} from '../models/team.model';

// Load Teams
export const loadTeams = createAction('[Teams] Load Teams');
export const loadTeamsSuccess = createAction('[Teams] Load Teams Success', props<{ teams: Team[] }>());
export const loadTeamsFailure = createAction('[Teams] Load Teams Failure', props<{ error: string }>());

// Get Team
export const getTeam = createAction('[Teams] Get Team', props<{ id: string }>());
export const getTeamSuccess = createAction('[Teams] Get Team Success', props<{ team: Team }>());
export const getTeamFailure = createAction('[Teams] Get Team Failure', props<{ error: string }>());

// Create Team
export const createTeam = createAction('[Teams] Create Team', props<{ team: CreateTeamRequest }>());
export const createTeamSuccess = createAction('[Teams] Create Team Success', props<{ team: Team }>());
export const createTeamFailure = createAction('[Teams] Create Team Failure', props<{ error: string }>());

// Update Team
export const updateTeam = createAction('[Teams] Update Team', props<{ id: string; team: UpdateTeamRequest }>());
export const updateTeamSuccess = createAction('[Teams] Update Team Success', props<{ team: Team }>());
export const updateTeamFailure = createAction('[Teams] Update Team Failure', props<{ error: string }>());

// Delete Team
export const deleteTeam = createAction('[Teams] Delete Team', props<{ id: string }>());
export const deleteTeamSuccess = createAction('[Teams] Delete Team Success', props<{ id: string }>());
export const deleteTeamFailure = createAction('[Teams] Delete Team Failure', props<{ error: string }>());

// Add Team Member
export const addTeamMember = createAction(
  '[Teams] Add Team Member', 
  props<{ teamId: string; member: AddMemberRequest }>()
);
export const addTeamMemberSuccess = createAction('[Teams] Add Team Member Success', props<{ team: Team }>());
export const addTeamMemberFailure = createAction('[Teams] Add Team Member Failure', props<{ error: string }>());

// Update Team Member
export const updateTeamMember = createAction(
  '[Teams] Update Team Member', 
  props<{ teamId: string; memberId: string; update: UpdateMemberRequest }>()
);
export const updateTeamMemberSuccess = createAction('[Teams] Update Team Member Success', props<{ team: Team }>());
export const updateTeamMemberFailure = createAction('[Teams] Update Team Member Failure', props<{ error: string }>());

// Remove Team Member
export const removeTeamMember = createAction(
  '[Teams] Remove Team Member', 
  props<{ teamId: string; memberId: string }>()
);
export const removeTeamMemberSuccess = createAction('[Teams] Remove Team Member Success', props<{ team: Team }>());
export const removeTeamMemberFailure = createAction('[Teams] Remove Team Member Failure', props<{ error: string }>());

// Leave Team
export const leaveTeam = createAction('[Teams] Leave Team', props<{ teamId: string }>());
export const leaveTeamSuccess = createAction('[Teams] Leave Team Success', props<{ teamId: string }>());
export const leaveTeamFailure = createAction('[Teams] Leave Team Failure', props<{ error: string }>());

// Clear Selected Team
export const clearSelectedTeam = createAction('[Teams] Clear Selected Team');