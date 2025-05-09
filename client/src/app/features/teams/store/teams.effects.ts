import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TeamService } from '../services/team.service';
import * as TeamsActions from './teams.actions';

@Injectable()
export class TeamsEffects {
  private actions$ = inject(Actions);
  private teamService = inject(TeamService);
  private router = inject(Router);

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      mergeMap(() =>
        this.teamService.getUserTeams().pipe(
          map(teams => TeamsActions.loadTeamsSuccess({ teams })),
          catchError(error => of(TeamsActions.loadTeamsFailure({ error: error.message })))
        )
      )
    )
  );

  getTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.getTeam),
      mergeMap(action =>
        this.teamService.getTeam(action.id).pipe(
          map(team => TeamsActions.getTeamSuccess({ team })),
          catchError(error => of(TeamsActions.getTeamFailure({ error: error.message })))
        )
      )
    )
  );

  createTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.createTeam),
      mergeMap(action =>
        this.teamService.createTeam(action.team).pipe(
          map(team => TeamsActions.createTeamSuccess({ team })),
          tap(({ team }) => {
            this.router.navigate(['/teams', team.id]);
          }),
          catchError(error => of(TeamsActions.createTeamFailure({ error: error.message })))
        )
      )
    )
  );

  updateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.updateTeam),
      mergeMap(action =>
        this.teamService.updateTeam(action.id, action.team).pipe(
          map(team => TeamsActions.updateTeamSuccess({ team })),
          catchError(error => of(TeamsActions.updateTeamFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.deleteTeam),
      mergeMap(action =>
        this.teamService.deleteTeam(action.id).pipe(
          map(() => TeamsActions.deleteTeamSuccess({ id: action.id })),
          tap(() => {
            this.router.navigate(['/teams']);
          }),
          catchError(error => of(TeamsActions.deleteTeamFailure({ error: error.message })))
        )
      )
    )
  );

  addTeamMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.addTeamMember),
      mergeMap(action =>
        this.teamService.addTeamMember(action.teamId, action.member).pipe(
          map(team => TeamsActions.addTeamMemberSuccess({ team })),
          catchError(error => of(TeamsActions.addTeamMemberFailure({ error: error.message })))
        )
      )
    )
  );

  updateTeamMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.updateTeamMember),
      mergeMap(action =>
        this.teamService.updateTeamMember(action.teamId, action.memberId, action.update).pipe(
          map(team => TeamsActions.updateTeamMemberSuccess({ team })),
          catchError(error => of(TeamsActions.updateTeamMemberFailure({ error: error.message })))
        )
      )
    )
  );

  removeTeamMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.removeTeamMember),
      mergeMap(action =>
        this.teamService.removeTeamMember(action.teamId, action.memberId).pipe(
          map(team => TeamsActions.removeTeamMemberSuccess({ team })),
          catchError(error => of(TeamsActions.removeTeamMemberFailure({ error: error.message })))
        )
      )
    )
  );

  leaveTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.leaveTeam),
      mergeMap(action =>
        this.teamService.leaveTeam(action.teamId).pipe(
          map(() => TeamsActions.leaveTeamSuccess({ teamId: action.teamId })),
          tap(() => {
            this.router.navigate(['/teams']);
          }),
          catchError(error => of(TeamsActions.leaveTeamFailure({ error: error.message })))
        )
      )
    )
  );
}