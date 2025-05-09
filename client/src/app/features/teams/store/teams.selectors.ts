import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeamsState } from './teams.state';

export const selectTeamsState = createFeatureSelector<TeamsState>('teams');

export const selectAllTeams = createSelector(
  selectTeamsState,
  (state: TeamsState) => state.teams
);

export const selectTeamsLoading = createSelector(
  selectTeamsState,
  (state: TeamsState) => state.loading
);

export const selectTeamsError = createSelector(
  selectTeamsState,
  (state: TeamsState) => state.error
);

export const selectSelectedTeam = createSelector(
  selectTeamsState,
  (state: TeamsState) => state.selectedTeam
);

export const selectTeamMembers = createSelector(
  selectSelectedTeam,
  (team) => team?.members || []
);

export const selectIsTeamOwner = (userId: string) => createSelector(
  selectSelectedTeam,
  (team) => team?.ownerId === userId
);

export const selectUserRole = (userId: string) => createSelector(
  selectSelectedTeam,
  (team) => team?.members.find(m => m.userId === userId)?.role
);

export const selectCanManageTeam = (userId: string) => createSelector(
  selectSelectedTeam,
  (team) => {
    if (!team) return false;
    
    const member = team.members.find(m => m.userId === userId);
    return member?.role === 'OWNER' || member?.role === 'ADMIN';
  }
);