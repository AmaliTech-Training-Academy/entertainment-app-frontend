// auth service file

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/v1/auth/login`, payload);
  }
}
