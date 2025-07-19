// core/services/admin/admin.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse, AdminUser } from '../../../models/admin-users';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly BASE_URL =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<PaginatedResponse<AdminUser>> {
    return this.http.get<PaginatedResponse<AdminUser>>(`${this.BASE_URL}/admin/users`);
  }

  // We'll add changeRole, ban/unban, delete later
}
