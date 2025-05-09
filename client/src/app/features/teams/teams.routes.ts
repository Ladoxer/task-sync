import { Routes } from '@angular/router';
import { TeamsListComponent } from './components/teams-list/teams-list.component';
import { TeamDetailComponent } from './components/team-detail/team-detail.component';
import { authGuard } from '../../core/guards/auth.guard';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    component: TeamsListComponent,
    canActivate: [authGuard]
  },
  {
    path: ':id',
    component: TeamDetailComponent,
    canActivate: [authGuard]
  }
];