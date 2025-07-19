import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/register`, payload);
  }
}
