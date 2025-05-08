import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../models/task.model';

// Load Tasks
export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction('[Tasks] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Tasks] Load Tasks Failure', props<{ error: string }>());

// Get Task
export const getTask = createAction('[Tasks] Get Task', props<{ id: string }>());
export const getTaskSuccess = createAction('[Tasks] Get Task Success', props<{ task: Task }>());
export const getTaskFailure = createAction('[Tasks] Get Task Failure', props<{ error: string }>());

// Create Task
export const createTask = createAction('[Tasks] Create Task', props<{ task: CreateTaskRequest }>());
export const createTaskSuccess = createAction('[Tasks] Create Task Success', props<{ task: Task }>());
export const createTaskFailure = createAction('[Tasks] Create Task Failure', props<{ error: string }>());

// Update Task
export const updateTask = createAction('[Tasks] Update Task', props<{ id: string; task: UpdateTaskRequest }>());
export const updateTaskSuccess = createAction('[Tasks] Update Task Success', props<{ task: Task }>());
export const updateTaskFailure = createAction('[Tasks] Update Task Failure', props<{ error: string }>());

// Delete Task
export const deleteTask = createAction('[Tasks] Delete Task', props<{ id: string }>());
export const deleteTaskSuccess = createAction('[Tasks] Delete Task Success', props<{ id: string }>());
export const deleteTaskFailure = createAction('[Tasks] Delete Task Failure', props<{ error: string }>());

// Update Task Status
export const updateTaskStatus = createAction(
  '[Tasks] Update Task Status',
  props<{ id: string; status: TaskStatus }>()
);

// WebSocket Events
export const taskCreatedFromSocket = createAction('[Tasks] Task Created From Socket', props<{ task: Task }>());
export const taskUpdatedFromSocket = createAction('[Tasks] Task Updated From Socket', props<{ task: Task }>());
export const taskDeletedFromSocket = createAction('[Tasks] Task Deleted From Socket', props<{ id: string }>());