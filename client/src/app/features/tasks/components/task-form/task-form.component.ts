import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TaskPriority } from '../../models/task.model';
import * as TasksActions from '../../store/tasks.actions';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();
  
  taskForm!: FormGroup;
  priorities = Object.values(TaskPriority);
  loading = false;
  error = '';
  
  private fb = inject(FormBuilder);
  private store = inject(Store);

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [TaskPriority.MEDIUM, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.store.dispatch(TasksActions.createTask({
      task: this.taskForm.value
    }));

    this.resetForm();
    this.formClosed.emit();
  }

  resetForm(): void {
    this.taskForm.reset({
      priority: TaskPriority.MEDIUM
    });
  }

  cancel(): void {
    this.resetForm();
    this.formClosed.emit();
  }

  clearError(): void {
    this.error = '';
  }
}