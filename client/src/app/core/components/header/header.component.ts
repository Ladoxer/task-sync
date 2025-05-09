import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  get isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  get userName(): string | null {
    const user = this.tokenService.getUser();
    return user ? user.name : null;
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/auth/login']);
  }
}