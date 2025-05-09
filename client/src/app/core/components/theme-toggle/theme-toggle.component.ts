import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="theme-toggle-btn" 
      (click)="toggleTheme()" 
      [attr.aria-label]="currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      <span *ngIf="currentTheme === 'light'" class="theme-icon">🌙</span>
      <span *ngIf="currentTheme === 'dark'" class="theme-icon">☀️</span>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    
    .theme-icon {
      font-size: 1.25rem;
    }
    
    /* Adjust button for dark mode */
    @media (prefers-color-scheme: dark) {
      .theme-toggle-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
    
    /* These will apply when dark theme is active via our theme service */
    :root[data-theme="dark"] .theme-toggle-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme: Theme = 'light';
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}