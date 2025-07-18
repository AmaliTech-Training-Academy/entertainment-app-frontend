import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1/auth/login`, { email, password });
  }
}
// Amasaman70#
//clement.adjei@amalitechtraining.org