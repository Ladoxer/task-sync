import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfile } from '../../models/user-profile.model';
import { UserService } from '../../services/user.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="profile-form-container">
      <h2>Personal Information</h2>
      
      <app-alert
        *ngIf="error"
        type="error"
        [message]="error"
        (dismissed)="clearError()">
      </app-alert>
      
      <app-alert
        *ngIf="success"
        type="success"
        message="Profile updated successfully!"
        (dismissed)="clearSuccess()">
      </app-alert>
      
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            placeholder="Enter your name"
            [ngClass]="{'invalid': isFieldInvalid('name')}"
          >
          <div class="error-message" *ngIf="isFieldInvalid('name')">
            <span *ngIf="profileForm.get('name')?.errors?.['required']">Name is required</span>
            <span *ngIf="profileForm.get('name')?.errors?.['minlength']">Name must be at least 3 characters</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            placeholder="Enter your email"
            [ngClass]="{'invalid': isFieldInvalid('email')}"
          >
          <div class="hint-text">Email cannot be changed</div>
        </div>
        
        <div class="form-group">
          <label for="jobTitle">Job Title (optional)</label>
          <input 
            type="text" 
            id="jobTitle" 
            formControlName="jobTitle" 
            placeholder="Enter your job title"
          >
        </div>
        
        <div class="form-group">
          <label for="department">Department (optional)</label>
          <input 
            type="text" 
            id="department" 
            formControlName="department" 
            placeholder="Enter your department"
          >
        </div>
        
        <div class="form-group">
          <label for="bio">Bio (optional)</label>
          <textarea 
            id="bio" 
            formControlName="bio" 
            placeholder="Enter a short bio about yourself"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Theme Preference</label>
          <div class="theme-options">
            <label class="radio-label">
              <input type="radio" formControlName="theme" value="light">
              Light Mode
            </label>
            <label class="radio-label">
              <input type="radio" formControlName="theme" value="dark">
              Dark Mode
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary" 
          [disabled]="profileForm.invalid || loading || !profileForm.dirty"
        >
          <app-loading-spinner *ngIf="loading" [size]="20"></app-loading-spinner>
          <span *ngIf="!loading">Update Profile</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .profile-form-container {
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
    
    input, textarea {
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
      
      &:disabled {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: not-allowed;
      }
    }
    
    .hint-text {
      font-size: 12px;
      color: var(--text-light-color);
      margin-top: 4px;
    }
    
    .error-message {
      color: var(--error-color);
      font-size: 14px;
      margin-top: 4px;
    }
    
    .theme-options {
      display: flex;
      gap: 20px;
    }
    
    .radio-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      input {
        width: auto;
        margin-right: 8px;
      }
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
export class ProfileFormComponent implements OnInit, OnChanges {
  @Input() userProfile: UserProfile | null = null;
  @Output() profileUpdated = new EventEmitter<UserProfile>();
  
  profileForm!: FormGroup;
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
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfile'] && this.userProfile && this.profileForm) {
      this.populateForm();
    }
  }
  
  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      jobTitle: [''],
      department: [''],
      bio: [''],
      theme: ['light']
    });
    
    this.populateForm();
  }
  
  private populateForm(): void {
    if (!this.userProfile) return;
    
    this.profileForm.patchValue({
      name: this.userProfile.name,
      email: this.userProfile.email,
      jobTitle: this.userProfile?.jobTitle || '',
      department: this.userProfile?.department || '',
      bio: this.userProfile?.bio || '',
      theme: this.userProfile?.theme || 'light'
    });
    
    // Mark form as pristine after populating
    this.profileForm.markAsPristine();
  }
  
  isFieldInvalid(field: string): boolean {
    const formControl = this.profileForm.get(field);
    return !!formControl && formControl.invalid && (formControl.dirty || formControl.touched);
  }
  
  onSubmit(): void {
    if (this.profileForm.invalid) return;
    
    this.loading = true;
    this.error = '';
    this.success = false;
    
    const profileData = {
      ...this.profileForm.getRawValue(),
      id: this.userProfile?.id
    };
    
    this.userService.updateUserProfile(profileData).subscribe({
      next: (updatedProfile) => {
        this.loading = false;
        this.success = true;
        this.profileForm.markAsPristine();
        this.profileUpdated.emit(updatedProfile);
        // this.userProfile = updatedProfile;
        // this.populateForm();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to update profile';
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