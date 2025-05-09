import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team } from '../../models/team.model';
import * as TeamsActions from '../../store/teams.actions';
import * as TeamsSelectors from '../../store/teams.selectors';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TeamFormComponent } from '../team-form/team-form.component';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AlertComponent,
    LoadingSpinnerComponent,
    TeamFormComponent
  ],
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  teams$: Observable<Team[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showCreateForm = false;
  
  constructor(private store: Store) {
    this.teams$ = this.store.select(TeamsSelectors.selectAllTeams);
    this.loading$ = this.store.select(TeamsSelectors.selectTeamsLoading);
    this.error$ = this.store.select(TeamsSelectors.selectTeamsError);
  }
  
  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeams());
  }
  
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }
  
  clearError(): void {
    // This would be handled by an action if we had a clearError action
  }
}