import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseUrl = environment.apiUrl;
  // private baseUrl = 'https://d101mapcha7bof.cloudfront.net';
  // private baseUrl = 'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com';
  private baseUrl = 'https://d101mapcha7bof.cloudfront.net';

  constructor(private http: HttpClient) {
    console.log(this.baseUrl);
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/login`, { email, password });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/refresh`, { refreshToken });
  }
}
