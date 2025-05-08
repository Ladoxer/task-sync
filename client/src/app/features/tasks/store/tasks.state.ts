import { Task } from '../models/task.model';

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null
};