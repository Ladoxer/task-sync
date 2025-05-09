import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  AddMemberRequest, 
  UpdateMemberRequest 
} from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;
  
  constructor(private http: HttpClient) {}
  
  // Get all teams for the current user
  getUserTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }
  
  // Get a specific team
  getTeam(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }
  
  // Create a new team
  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }
  
  // Update an existing team
  updateTeam(id: string, team: UpdateTeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }
  
  // Delete a team
  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Add a member to a team
  addTeamMember(teamId: string, member: AddMemberRequest): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/members`, member);
  }
  
  // Update a team member's role
  updateTeamMember(teamId: string, memberId: string, update: UpdateMemberRequest): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${teamId}/members/${memberId}`, update);
  }
  
  // Remove a member from a team
  removeTeamMember(teamId: string, memberId: string): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/members/${memberId}`);
  }
  
  // Leave a team
  leaveTeam(teamId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${teamId}/leave`, {});
  }
}