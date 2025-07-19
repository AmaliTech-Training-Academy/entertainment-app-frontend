// core/services/admin/admin.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse, AdminUser, UserRoleUpdateResponse } from '../../../models/admin-users';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly BASE_URL =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all users
   */
  getAllUsers(): Observable<PaginatedResponse<AdminUser>> {
    return this.http.get<PaginatedResponse<AdminUser>>(`${this.BASE_URL}/admin/users`);
  }

  /**
   * Change a user's role - CORRECTED VERSION with multiple payload attempts
   */
  changeUserRole(userId: number, newRole: string): Observable<UserRoleUpdateResponse> {
    // Try the payload structure from API documentation first
    const payload = {
      userId: userId,
      newRole: newRole,
    };

    console.log('Making API call to:', `${this.BASE_URL}/admin/users/change-role`);
    console.log('With payload:', payload);
    console.log('Role value being sent:', newRole);

    return this.http.put<UserRoleUpdateResponse>(
      `${this.BASE_URL}/admin/users/change-role`,
      payload,
    );
  }

  /**
   * Toggle ban status of a user
   */
  toggleBanUser(userId: number): Observable<UserRoleUpdateResponse> {
    return this.http.put<UserRoleUpdateResponse>(`${this.BASE_URL}/admin/${userId}/ban`, null);
  }
}
