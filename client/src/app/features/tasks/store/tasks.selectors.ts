import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { TaskStatus } from '../models/task.model';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state: TasksState) => state.tasks
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state: TasksState) => state.error
);

export const selectSelectedTask = createSelector(
  selectTasksState,
  (state: TasksState) => state.selectedTask
);

export const selectTasksByStatus = (status: TaskStatus) => createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === status)
);

export const selectTodoTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.TODO)
);

export const selectInProgressTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.IN_PROGRESS)
);

export const selectDoneTasks = createSelector(
  selectAllTasks,
  (tasks) => tasks.filter(task => task.status === TaskStatus.DONE)
);