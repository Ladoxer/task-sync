import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../core/services/token.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatusSubject.asObservable();

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          this.tokenService.saveToken(response.token);
          this.tokenService.saveUser(response.user);
          this.authStatusSubject.next(true);
        })
      );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    this.tokenService.clear();
    this.authStatusSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  getUserName(): Observable<string | null> {
    const user = this.tokenService.getUser();
    return of(user ? user.name : null);
  }
}