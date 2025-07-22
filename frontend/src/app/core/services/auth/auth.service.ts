import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface AuthResponseData {
  id: number;
  email: string;
  username: string;
  roles: string[];
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: AuthResponseData;
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/login`, { email, password });
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/register`, payload);
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/refresh`, { refreshToken });
  }

  logout() {
    document.cookie = 'auth_token=; Max-Age=0; path=/;';
    document.cookie = 'auth_user=; Max-Age=0; path=/;';
    this.router.navigate(['/']);
  }
}
