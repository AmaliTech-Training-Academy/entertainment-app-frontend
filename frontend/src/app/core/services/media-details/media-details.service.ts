import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { MediaDetails, MediaDetailsResponse } from '../../../shared/components/media-details';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class MediaDetailsService {
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  getMediaDetailsById(mediaId: number): Observable<MediaDetailsResponse> {
    return this.http
      .get<MediaDetailsResponse>(`${this.apiUrl}/api/v1/media/detail/${mediaId}`)
      .pipe(catchError((error) => this.errorHandler.handleHttpError(error)));
  }

  addToFavorites(userId: number, mediaId: number): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/api/v1/users/${userId}/favorites/media/${mediaId}`,
      {},
    );
  }
}
