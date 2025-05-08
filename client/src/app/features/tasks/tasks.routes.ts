import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { authGuard } from '../../core/guards/auth.guard';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TaskListComponent,
    canActivate: [authGuard]
  }
];