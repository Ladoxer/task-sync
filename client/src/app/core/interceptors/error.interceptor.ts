import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout if 401 response returned from api
        tokenService.clear();
        router.navigate(['/auth/login']);
      }
      
      const errorMessage = error.error?.error?.message || 'An error occurred';
      return throwError(() => new Error(errorMessage));
    })
  );
};