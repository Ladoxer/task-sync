import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task, TaskStatus, TaskPriority } from '../../../tasks/models/task.model';
import { TaskService } from '../../../tasks/services/task.service';
import { TaskItemComponent } from '../../../tasks/components/task-item/task-item.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-team-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskItemComponent,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './team-tasks.component.html',
  styleUrls: ['./team-tasks.component.scss']
})
export class TeamTasksComponent implements OnInit {
  @Input() teamId!: string;
  @Input() canManage = false;
  
  tasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  taskForm!: FormGroup;
  showTaskForm = false;
  loading = false;
  error = '';
  
  priorities = Object.values(TaskPriority);
  TaskStatus = TaskStatus;
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    this.loadTeamTasks();
  }
  
  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: ['']
    });
  }
  
  loadTeamTasks(): void {
    this.loading = true;
    this.error = '';
    
    this.taskService.getTeamTasks(this.teamId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filterTasks();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load team tasks';
        this.loading = false;
      }
    });
  }
  
  private filterTasks(): void {
    this.todoTasks = this.tasks.filter(task => task.status === TaskStatus.TODO);
    this.inProgressTasks = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    this.doneTasks = this.tasks.filter(task => task.status === TaskStatus.DONE);
  }
  
  toggleTaskForm(): void {
    this.showTaskForm = !this.showTaskForm;
    if (!this.showTaskForm) {
      this.taskForm.reset({
        priority: TaskPriority.MEDIUM
      });
    }
  }
  
  onCreateTask(): void {
    if (this.taskForm.invalid) return;
    
    const formValue = this.taskForm.value;
    const task = {
      ...formValue,
      teamId: this.teamId
    };
    
    this.loading = true;
    this.taskService.createTeamTask(this.teamId, task).subscribe({
      next: (newTask) => {
        this.tasks = [...this.tasks, newTask];
        this.filterTasks();
        this.toggleTaskForm();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to create task';
        this.loading = false;
      }
    });
  }
  
  onTaskStatusChange(event: { taskId: string; status: TaskStatus }): void {
    this.loading = true;
    
    this.taskService.updateTask(event.taskId, { status: event.status }).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        this.filterTasks();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to update task status';
        this.loading = false;
        // Reload tasks to ensure UI consistency
        this.loadTeamTasks();
      }
    });
  }
  
  onTaskDelete(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.loading = true;
      
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== taskId);
          this.filterTasks();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete task';
          this.loading = false;
          // Reload tasks to ensure UI consistency
          this.loadTeamTasks();
        }
      });
    }
  }
  
  clearError(): void {
    this.error = '';
  }
}