import { createReducer, on } from '@ngrx/store';
import { initialTeamsState } from './teams.state';
import * as TeamsActions from './teams.actions';

export const teamsReducer = createReducer(
  initialTeamsState,
  
  // Load Teams
  on(TeamsActions.loadTeams, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.loadTeamsSuccess, (state, { teams }) => ({
    ...state,
    teams,
    loading: false
  })),
  on(TeamsActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Team
  on(TeamsActions.getTeam, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.getTeamSuccess, (state, { team }) => ({
    ...state,
    selectedTeam: team,
    loading: false
  })),
  on(TeamsActions.getTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Team
  on(TeamsActions.createTeam, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.createTeamSuccess, (state, { team }) => ({
    ...state,
    teams: [...state.teams, team],
    selectedTeam: team,
    loading: false
  })),
  on(TeamsActions.createTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Team
  on(TeamsActions.updateTeam, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.updateTeamSuccess, (state, { team }) => ({
    ...state,
    teams: state.teams.map(t => t.id === team.id ? team : t),
    selectedTeam: team,
    loading: false
  })),
  on(TeamsActions.updateTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Team
  on(TeamsActions.deleteTeam, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.deleteTeamSuccess, (state, { id }) => ({
    ...state,
    teams: state.teams.filter(team => team.id !== id),
    selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam,
    loading: false
  })),
  on(TeamsActions.deleteTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Team Member Operations
  on(
    TeamsActions.addTeamMember,
    TeamsActions.updateTeamMember,
    TeamsActions.removeTeamMember,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  on(
    TeamsActions.addTeamMemberSuccess,
    TeamsActions.updateTeamMemberSuccess,
    TeamsActions.removeTeamMemberSuccess,
    (state, { team }) => ({
      ...state,
      teams: state.teams.map(t => t.id === team.id ? team : t),
      selectedTeam: team,
      loading: false
    })
  ),
  on(
    TeamsActions.addTeamMemberFailure,
    TeamsActions.updateTeamMemberFailure,
    TeamsActions.removeTeamMemberFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  ),
  
  // Leave Team
  on(TeamsActions.leaveTeam, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TeamsActions.leaveTeamSuccess, (state, { teamId }) => ({
    ...state,
    teams: state.teams.filter(team => team.id !== teamId),
    selectedTeam: state.selectedTeam?.id === teamId ? null : state.selectedTeam,
    loading: false
  })),
  on(TeamsActions.leaveTeamFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Clear Selected Team
  on(TeamsActions.clearSelectedTeam, (state) => ({
    ...state,
    selectedTeam: null
  }))
);