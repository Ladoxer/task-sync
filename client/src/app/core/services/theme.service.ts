import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  theme$ = this.themeSubject.asObservable();
  
  constructor() {
    // Apply the initial theme
    this.applyTheme(this.themeSubject.value);
  }
  
  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Otherwise, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light theme
    return 'light';
  }
  
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }
  
  setTheme(theme: Theme): void {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update the subject
    this.themeSubject.next(theme);
    
    // Apply the theme
    this.applyTheme(theme);
  }
  
  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
  
  private applyTheme(theme: Theme): void {
    // Set data-theme attribute on the document element
    document.documentElement.setAttribute('data-theme', theme);
  }
}