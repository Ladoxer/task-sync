import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TokenService } from '../../../../core/services/token.service';
import { Team, TeamRole } from '../../models/team.model';
import * as TeamsActions from '../../store/teams.actions';
import * as TeamsSelectors from '../../store/teams.selectors';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { TeamFormComponent } from '../team-form/team-form.component';
import { TeamMembersComponent } from '../team-members/team-members.component';
import { TeamTasksComponent } from '../team-tasks/team-tasks.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AlertComponent,
    LoadingSpinnerComponent,
    TeamFormComponent,
    TeamMembersComponent,
    TeamTasksComponent
  ],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit, OnDestroy {
  team$: Observable<Team | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isOwner$: Observable<boolean>;
  canManage$: Observable<boolean>;
  currentUserId: string;
  showEditForm = false;
  activeTab: 'tasks' | 'members' = 'tasks';
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private tokenService: TokenService
  ) {
    this.team$ = this.store.select(TeamsSelectors.selectSelectedTeam);
    this.loading$ = this.store.select(TeamsSelectors.selectTeamsLoading);
    this.error$ = this.store.select(TeamsSelectors.selectTeamsError);
    
    const user = this.tokenService.getUser();
    this.currentUserId = user?.id || '';
    
    this.isOwner$ = this.store.select(TeamsSelectors.selectIsTeamOwner(this.currentUserId));
    this.canManage$ = this.store.select(TeamsSelectors.selectCanManageTeam(this.currentUserId));
  }
  
  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.store.dispatch(TeamsActions.getTeam({ id }));
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(TeamsActions.clearSelectedTeam());
  }
  
  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }
  
  deleteTeam(teamId: string): void {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      this.store.dispatch(TeamsActions.deleteTeam({ id: teamId }));
    }
  }
  
  leaveTeam(teamId: string): void {
    if (confirm('Are you sure you want to leave this team?')) {
      this.store.dispatch(TeamsActions.leaveTeam({ teamId }));
    }
  }
  
  setActiveTab(tab: 'tasks' | 'members'): void {
    this.activeTab = tab;
  }
  
  clearError(): void {
    // This would be handled by an action if we had a clearError action
  }
  
  getRoleBadgeClass(role: TeamRole): string {
    switch (role) {
      case TeamRole.OWNER:
        return 'badge-primary';
      case TeamRole.ADMIN:
        return 'badge-success';
      case TeamRole.MEMBER:
        return 'badge-info';
      default:
        return '';
    }
  }
}