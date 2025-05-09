import { Team } from '../models/team.model';

export interface TeamsState {
  teams: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

export const initialTeamsState: TeamsState = {
  teams: [],
  selectedTeam: null,
  loading: false,
  error: null
};