import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { PasswordFormComponent } from '../password-form/password-form.component';
import { UserProfile } from '../../models/user-profile.model';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileFormComponent,
    PasswordFormComponent,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="profile-container">
      <h1>User Profile</h1>
      
      <div *ngIf="loading" class="loading-container">
        <app-loading-spinner [size]="40"></app-loading-spinner>
      </div>
      
      <app-alert
        *ngIf="error"
        type="error"
        [message]="error"
        (dismissed)="clearError()">
      </app-alert>
      
      <div class="profile-content" *ngIf="!loading && userProfile">
        <app-profile-form 
          [userProfile]="userProfile"
          (profileUpdated)="onProfileUpdated($event)">
        </app-profile-form>
        
        <app-password-form
          (passwordUpdated)="onPasswordUpdated()">
        </app-password-form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: var(--text-color);
      margin-bottom: 20px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      margin: 40px 0;
    }
    
    .profile-content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
    }
    
    @media (min-width: 768px) {
      .profile-content {
        grid-template-columns: 2fr 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  loading = false;
  error = '';
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loadUserProfile();
  }
  
  loadUserProfile(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load user profile';
        this.loading = false;
      }
    });
  }
  
  onProfileUpdated(profile: UserProfile): void {
    this.userProfile = profile;
  }
  
  onPasswordUpdated(): void {
    // Just a notification, no need to reload anything
  }
  
  clearError(): void {
    this.error = '';
  }
}