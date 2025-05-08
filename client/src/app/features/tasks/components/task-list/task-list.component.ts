import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../../models/task.model';
import * as TasksActions from '../../store/tasks.actions';
import * as TasksSelectors from '../../store/tasks.selectors';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule, 
    TaskItemComponent, 
    TaskFormComponent, 
    LoadingSpinnerComponent,
    AlertComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  todoTasks$: Observable<Task[]>;
  inProgressTasks$: Observable<Task[]>;
  doneTasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  showForm = false;

  private store = inject(Store);
  
  TaskStatus = TaskStatus;

  constructor() {
    this.todoTasks$ = this.store.select(TasksSelectors.selectTodoTasks);
    this.inProgressTasks$ = this.store.select(TasksSelectors.selectInProgressTasks);
    this.doneTasks$ = this.store.select(TasksSelectors.selectDoneTasks);
    this.loading$ = this.store.select(TasksSelectors.selectTasksLoading);
    this.error$ = this.store.select(TasksSelectors.selectTasksError);
  }

  ngOnInit(): void {
    this.store.dispatch(TasksActions.loadTasks());
  }

  onTaskStatusChange(event: { taskId: string; status: TaskStatus }): void {
    this.store.dispatch(TasksActions.updateTaskStatus({
      id: event.taskId,
      status: event.status
    }));
  }

  onTaskDelete(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TasksActions.deleteTask({ id: taskId }));
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  clearError(): void {
    // Implement a method to clear the error if needed
  }
}