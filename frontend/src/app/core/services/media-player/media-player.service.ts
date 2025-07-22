import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaPlayerService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTrailerUrl(contentId: number): Observable<string> {
    return this.http
      .get(`${this.apiUrl}/api/v1/media/${contentId}/trailer`, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching trailer URL:', error);
          if (error.status === 0) {
            console.error('Network error - possible CORS issue or server not reachable');
          }
          return throwError(() => error);
        }),
      );
  }
}
