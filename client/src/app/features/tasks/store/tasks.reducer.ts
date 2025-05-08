import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './tasks.state';
import * as TasksActions from './tasks.actions';

export const tasksReducer = createReducer(
  initialTasksState,
  
  // Load Tasks
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false
  })),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Task
  on(TasksActions.getTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.getTaskSuccess, (state, { task }) => ({
    ...state,
    selectedTask: task,
    loading: false
  })),
  on(TasksActions.getTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Task
  on(TasksActions.createTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: false
  })),
  on(TasksActions.createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Task
  on(TasksActions.updateTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    loading: false
  })),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Task
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    loading: false
  })),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // WebSocket Events
  on(TasksActions.taskCreatedFromSocket, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),
  on(TasksActions.taskUpdatedFromSocket, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask
  })),
  on(TasksActions.taskDeletedFromSocket, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
  }))
);