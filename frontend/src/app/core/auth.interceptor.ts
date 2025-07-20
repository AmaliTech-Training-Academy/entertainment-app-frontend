import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/login/auth.service';
=======
import { AuthService } from './services/auth/auth.service';
>>>>>>> 33f79c0bfac0112e5b3cb6e739ec286b0a40e06a

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  private getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies[name];
  }

  private clearAuthCookies(): void {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-error'],
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-success'],
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding Authorization header for login and register requests
    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');
    if (isAuthRequest) {
      return next.handle(req);
    }

    const token = this.getCookie('auth_token');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          const refreshToken = this.getCookie('refresh_token');

          if (refreshToken && !this.isRefreshing) {
            this.isRefreshing = true;

            return this.authService.refreshToken(refreshToken).pipe(
              switchMap((response: any) => {
                this.isRefreshing = false;
                const { token: newToken, refreshToken: newRefreshToken } = response.data || {};

                if (newToken) {
<<<<<<< HEAD
                  // Set new tokens in cookies
                  document.cookie = `auth_token=${newToken}; path=/; secure; samesite=strict;`;
                  if (newRefreshToken) {
                    document.cookie = `refresh_token=${newRefreshToken}; path=/; secure; samesite=strict;`;
                  }

                  // Show success message for token refresh
                  this.showSuccessMessage('Session refreshed successfully');

                  // Retry the original request with the new token
                  const retryReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`,
                      'Content-Type': 'application/json',
                      Accept: '*/*',
                    },
                  });
                  return next.handle(retryReq);
                } else {
                  // Token refresh failed, redirect to login
                  this.handleAuthFailure('Session expired. Please login again.');
                  return throwError(() => error);
                }
              }),
              catchError((refreshError: HttpErrorResponse) => {
                this.isRefreshing = false;
                // Refresh token is invalid or expired
                this.handleAuthFailure('Session expired. Please login again.');
                return throwError(() => refreshError);
=======
                  document.cookie = `auth_token=${newToken}; path=/; SameSite=None; Secure`;
                }
                if (newRefreshToken) {
                  document.cookie = `refresh_token=${newRefreshToken}; path=/; SameSite=None; Secure`;
                }
                // Retry the original request with the new token
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                  withCredentials: true,
                });
                return next.handle(retryReq);
>>>>>>> 33f79c0bfac0112e5b3cb6e739ec286b0a40e06a
              }),
            );
          } else {
            // No refresh token available or already refreshing
            this.handleAuthFailure('Authentication required. Please login.');
            return throwError(() => error);
          }
        }

        // Handle 403 Forbidden errors
        if (error.status === 403) {
          this.showErrorMessage('You do not have permission to perform this action.');
          return throwError(() => error);
        }

        // Handle 404 Not Found errors for admin endpoints
        if (error.status === 404 && req.url.includes('/admin/')) {
          this.showErrorMessage('Admin endpoint not found. Please check the URL.');
          return throwError(() => error);
        }

        // Handle 500 Server errors
        if (error.status >= 500) {
          this.showErrorMessage('Server error occurred. Please try again later.');
          return throwError(() => error);
        }

        // Handle network errors
        if (error.status === 0) {
          this.showErrorMessage('Network error. Please check your connection.');
          return throwError(() => error);
        }

        return throwError(() => error);
      }),
    );
  }

  private handleAuthFailure(message: string): void {
    this.clearAuthCookies();
    this.showErrorMessage(message);
    this.router.navigate(['/login']);
  }
}
