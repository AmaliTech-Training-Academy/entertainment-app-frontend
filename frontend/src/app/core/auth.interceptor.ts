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
import { AuthService } from './services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  private getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies[name];
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
        },
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = this.getCookie('refresh_token');
          if (refreshToken) {
            return this.authService.refreshToken(refreshToken).pipe(
              switchMap((response: any) => {
                const { token: newToken, refreshToken: newRefreshToken } = response.data || {};
                if (newToken) {
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
              }),
            );
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
