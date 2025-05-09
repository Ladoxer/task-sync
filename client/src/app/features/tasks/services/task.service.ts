import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private socket = inject(Socket);
  private apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Using the observable creation pattern for type safety
  onTaskCreated(): Observable<Task> {
    return new Observable<Task>((observer) => {
      this.socket.on('task:created', (data: Task) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('task:created');
      };
    });
  }

  onTaskUpdated(): Observable<Task> {
    return new Observable<Task>((observer) => {
      this.socket.on('task:updated', (data: Task) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('task:updated');
      };
    });
  }

  onTaskDeleted(): Observable<{ id: string }> {
    return new Observable<{ id: string }>((observer) => {
      this.socket.on('task:deleted', (data: { id: string }) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('task:deleted');
      };
    });
  }

  // Get tasks for a specific team
  getTeamTasks(teamId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/team/${teamId}`);
  }

  // Create a task within a team
  createTeamTask(teamId: string, task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/team/${teamId}`, task);
  }

  // Assign a task to a team member
  assignTask(taskId: string, assigneeId: string): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${taskId}/assign`, {
      assigneeId,
    });
  }

  // Get tasks assigned to the current user
  getAssignedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/assigned`);
  }
}
