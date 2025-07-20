// core/services/admin/admin.service.ts
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaginatedResponse, AdminUser, UserRoleUpdateResponse } from '../../../models/admin-users';
import { PaginatedMediaResponse } from '../../../models/media.model';

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

  /**
   * Fetch paginated media listings with optional keyword filtering
   * Use this for general browsing without search
   */
  getPaginatedMedia(page: number, size: number, keyword?: string | null): Observable<any> {
    // Changed to 'any' to avoid TypeScript issues
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

  /**
   * Search media by title using the dedicated search endpoint
   * This is the primary method for searching movies by title
   */
  searchMedia(query: string, page: number = 0, size: number = 10): Observable<any> {
    // Changed to 'any' to avoid TypeScript issues
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

  /**
   * Alternative search method - searches specifically by title
   * Use this if the main search endpoint doesn't work as expected
   */
  searchByTitle(title: string, page: number = 0, size: number = 10): Observable<any> {
    // Changed to 'any' to avoid TypeScript issues
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

  /**
   * Advanced search with multiple criteria
   * Use this for more complex search scenarios
   */
  advancedSearchMedia(searchCriteria: {
    title?: string;
    year?: number;
    rating?: number;
    mediaType?: string;
    page?: number;
    size?: number;
  }): Observable<any> {
    // Changed to 'any' to avoid TypeScript issues
    let params = new HttpParams();

    // Set default pagination if not provided
    const page = searchCriteria.page ?? 0;
    const size = searchCriteria.size ?? 10;

    params = params.set('page', page.toString()).set('size', size.toString());

    // Add search criteria
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

  /**
   * Fallback method: Use listings endpoint with keyword parameter for search
   * This can be used if dedicated search endpoints are not working
   */
  searchUsingListings(query: string, page: number = 0, size: number = 10): Observable<any> {
    // Changed to 'any' to avoid TypeScript issues
    return this.getPaginatedMedia(page, size, query);
  }

  /**
   * Get admin metrics/dashboard data
   */
  getAdminMetrics(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/admin/metrics`).pipe(catchError(this.handleError));
  }

  /**
   * Get recent activities for admin dashboard
   */
  getRecentActivities(): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}/admin/recent-activities`)
      .pipe(catchError(this.handleError));
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

  /**
   * Update media by ID
   */
  updateMedia(mediaId: number, mediaData: any): Observable<any> {
    return this.http
      .put<any>(`${this.BASE_URL}/media/${mediaId}`, mediaData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get single media item by ID
   */
  getMediaById(mediaId: number): Observable<any> {
    return this.http
      .get<any>(`${this.BASE_URL}/media/${mediaId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Test the search endpoint to verify it's working
   */
  testSearchEndpoint(query: string = 'test'): Observable<any> {
    console.log('Testing search endpoint with query:', query);
    return this.searchMedia(query, 0, 1).pipe(
      map((response) => ({
        success: true,
        data: response,
        message: 'Search endpoint is working',
      })),
      catchError((error) => {
        console.error('Search endpoint test failed:', error);
        return throwError(() => ({
          success: false,
          error: error,
          message: 'Search endpoint is not working',
        }));
      }),
    );
  }

  /**
   * Error handling method
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

      // Log additional details for debugging
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
