import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="password-form-container">
      <h2>Change Password</h2>
      
      <app-alert
        *ngIf="error"
        type="error"
        [message]="error"
        (dismissed)="clearError()">
      </app-alert>
      
      <app-alert
        *ngIf="success"
        type="success"
        message="Password updated successfully!"
        (dismissed)="clearSuccess()">
      </app-alert>
      
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input 
            type="password" 
            id="currentPassword" 
            formControlName="currentPassword" 
            placeholder="Enter your current password"
            [ngClass]="{'invalid': isFieldInvalid('currentPassword')}"
          >
          <div class="error-message" *ngIf="isFieldInvalid('currentPassword')">
            <span *ngIf="passwordForm.get('currentPassword')?.errors?.['required']">Current password is required</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input 
            type="password" 
            id="newPassword" 
            formControlName="newPassword" 
            placeholder="Enter your new password"
            [ngClass]="{'invalid': isFieldInvalid('newPassword')}"
          >
          <div class="error-message" *ngIf="isFieldInvalid('newPassword')">
            <span *ngIf="passwordForm.get('newPassword')?.errors?.['required']">New password is required</span>
            <span *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">Password must be at least 6 characters</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            formControlName="confirmPassword" 
            placeholder="Confirm your new password"
            [ngClass]="{'invalid': isFieldInvalid('confirmPassword')}"
          >
          <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
            <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['required']">Confirm password is required</span>
            <span *ngIf="passwordForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="passwordForm.invalid || loading"
        >
          <app-loading-spinner *ngIf="loading" [size]="20"></app-loading-spinner>
          <span *ngIf="!loading">Update Password</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .password-form-container {
      background-color: var(--surface-color);
      border-radius: 8px;
      box-shadow: 0 2px 4px var(--shadow-color);
      padding: 20px;
    }
    
    h2 {
      color: var(--text-color);
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-color);
      font-weight: 500;
    }
    
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 16px;
      background-color: var(--surface-color);
      color: var(--text-color);
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      
      &.invalid {
        border-color: var(--error-color);
      }
    }
    
    .error-message {
      color: var(--error-color);
      font-size: 14px;
      margin-top: 4px;
    }
    
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      height: 44px;
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
    
    .btn-primary {
      background-color: var(--primary-color);
      color: white;
      
      &:hover:not(:disabled) {
        background-color: #2980b9;
      }
    }
  `]
})
export class PasswordFormComponent implements OnInit {
  @Output() passwordUpdated = new EventEmitter<void>();
  
  passwordForm!: FormGroup;
  loading = false;
  success = false;
  error = '';
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  isFieldInvalid(field: string): boolean {
    const formControl = this.passwordForm.get(field);
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
  }
  
  onSubmit(): void {
    if (this.passwordForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    this.success = false;
    
    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };
    
    this.userService.updatePassword(passwordData).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.passwordForm.reset();
        this.passwordUpdated.emit();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to update password';
      }
    });
  }
  
  clearError(): void {
    this.error = '';
  }
  
  clearSuccess(): void {
    this.success = false;
  }
}