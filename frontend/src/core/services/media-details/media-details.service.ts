import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { MediaDetails, MediaDetailsResponse } from '../../../app/shared/components/media-details';
import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class MediaDetailsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

   getMediaDetailsById(mediaId: number): Observable<MediaDetails> {
    return this.http.get<MediaDetailsResponse>(`${this.apiUrl}/api/v1/media/${mediaId}`)
      .pipe(
        map(response => response.data),
        catchError((error) => this.errorHandler.handleHttpError(error))
      );
  }
}



