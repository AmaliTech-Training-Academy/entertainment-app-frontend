// core/services/admin/admin.service.ts
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaginatedResponse, AdminUser, UserRoleUpdateResponse } from '../../../models/admin-users';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly BASE_URL =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1';

  constructor(private http: HttpClient) {}

  // User management methods
  getAllUsers(): Observable<PaginatedResponse<AdminUser>> {
    return this.http
      .get<PaginatedResponse<AdminUser>>(`${this.BASE_URL}/admin/users`)
      .pipe(catchError(this.handleError));
  }

  changeUserRole(userId: number, newRole: string): Observable<UserRoleUpdateResponse> {
    const payload = { userId, newRole };
    return this.http
      .put<UserRoleUpdateResponse>(`${this.BASE_URL}/admin/users/change-role`, payload)
      .pipe(catchError(this.handleError));
  }

  toggleBanUser(userId: number): Observable<UserRoleUpdateResponse> {
    return this.http
      .put<UserRoleUpdateResponse>(`${this.BASE_URL}/admin/users/${userId}/ban`, {})
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.BASE_URL}/admin/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  getPaginatedMedia(page: number, size: number, keyword?: string | null): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    console.log('Getting paginated media:', { page, size, keyword });

    return this.http.get<any>(`${this.BASE_URL}/media/listings`, { params }).pipe(
      tap((response) => console.log('Paginated media response:', response)),
      catchError(this.handleError),
    );
  }

  searchMedia(query: string, page: number = 0, size: number = 10): Observable<any> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      console.warn('Empty search query provided');
      return throwError(() => new Error('Search query cannot be empty'));
    }

    let params = new HttpParams()
      .set('q', trimmedQuery)
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('Searching media with query:', { query: trimmedQuery, page, size });

    return this.http.get<any>(`${this.BASE_URL}/media/search`, { params }).pipe(
      tap((response) => console.log('Search response:', response)),
      catchError((error) => {
        console.error('Search error:', error);
        return this.handleError(error);
      }),
    );
  }
  searchByTitle(title: string, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('title', title.trim())
      .set('page', page.toString())
      .set('size', size.toString());

    console.log('Searching by title:', { title, page, size });

    return this.http.get<any>(`${this.BASE_URL}/media/search-by-title`, { params }).pipe(
      tap((response) => console.log('Search by title response:', response)),
      catchError(this.handleError),
    );
  }

  advancedSearchMedia(searchCriteria: {
    title?: string;
    year?: number;
    rating?: number;
    mediaType?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    let params = new HttpParams();

    const page = searchCriteria.page ?? 0;
    const size = searchCriteria.size ?? 10;

    params = params.set('page', page.toString()).set('size', size.toString());

    Object.keys(searchCriteria).forEach((key) => {
      if (key !== 'page' && key !== 'size') {
        const value = searchCriteria[key as keyof typeof searchCriteria];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      }
    });

    console.log('Advanced search criteria:', searchCriteria);

    return this.http.get<any>(`${this.BASE_URL}/media/advanced-search`, { params }).pipe(
      tap((response) => console.log('Advanced search response:', response)),
      catchError(this.handleError),
    );
  }

  searchUsingListings(query: string, page: number = 0, size: number = 10): Observable<any> {
    return this.getPaginatedMedia(page, size, query);
  }

  getAdminMetrics(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/admin/metrics`).pipe(catchError(this.handleError));
  }

  /**
   * Create new media content
   */
  createMedia(mediaData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.BASE_URL}/media`, mediaData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete media by ID
   */
  deleteMedia(mediaId: number): Observable<any> {
    console.log('Deleting media with ID:', mediaId);
    return this.http.delete<any>(`${this.BASE_URL}/media/${mediaId}`).pipe(
      tap((response) => console.log('Delete response:', response)),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

      console.error('HTTP Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        error: error.error,
      });
    }

    console.error('Service Error:', errorMessage);
    return throwError(() => error);
  }
}
