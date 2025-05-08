import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { merge, NEVER, of } from 'rxjs';
import { TaskService } from '../services/task.service';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  private store = inject(Store);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => TasksActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TasksActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  getTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.getTask),
      mergeMap(action =>
        this.taskService.getTask(action.id).pipe(
          map(task => TasksActions.getTaskSuccess({ task })),
          catchError(error => of(TasksActions.getTaskFailure({ error: error.message })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap(action =>
        this.taskService.createTask(action.task).pipe(
          map(task => TasksActions.createTaskSuccess({ task })),
          catchError(error => of(TasksActions.createTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap(action =>
        this.taskService.updateTask(action.id, action.task).pipe(
          map(task => TasksActions.updateTaskSuccess({ task })),
          catchError(error => of(TasksActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskStatus),
      mergeMap(action =>
        this.taskService.updateTask(action.id, { status: action.status }).pipe(
          map(task => TasksActions.updateTaskSuccess({ task })),
          catchError(error => of(TasksActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(action =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TasksActions.deleteTaskSuccess({ id: action.id })),
          catchError(error => of(TasksActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );

  // Socket.io effects
  setupSocketListeners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasksSuccess),
      switchMap(() => {
        // Create a merged stream of all socket events
        const created$ = this.taskService.onTaskCreated().pipe(
          tap(task => {
            this.store.dispatch(TasksActions.taskCreatedFromSocket({ task }));
          })
        );

        const updated$ = this.taskService.onTaskUpdated().pipe(
          tap(task => {
            console.log('Updated task:', task);
            this.store.dispatch(TasksActions.taskUpdatedFromSocket({ task }));
          })
        );

        const deleted$ = this.taskService.onTaskDeleted().pipe(
          tap(({ id }) => {
            this.store.dispatch(TasksActions.taskDeletedFromSocket({ id }));
          })
        );
        return merge(created$, updated$, deleted$).pipe(
          switchMap(() => NEVER)
        );
      })
    ),
    { dispatch: false }
  );
}