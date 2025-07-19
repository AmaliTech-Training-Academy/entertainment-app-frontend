import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminMetrics } from '../../../models/admin-metrics';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly BASE_URL =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1/admin';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<AdminMetrics> {
    return this.http.get<AdminMetrics>(`${this.BASE_URL}/metrics`);
  }
}
