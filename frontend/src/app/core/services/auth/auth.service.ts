import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  // private baseUrl = environment.apiUrl;
  private baseUrl = 'https://d101mapcha7bof.cloudfront.net';
  // private baseUrl = 'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com';
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/login`, { email, password });
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/register`, payload);
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/refresh`, { refreshToken });
  }
}
