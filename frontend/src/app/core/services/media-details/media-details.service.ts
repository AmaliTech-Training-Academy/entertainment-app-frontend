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
  private apiUrl = 'https://d101mapcha7bof.cloudfront.net';
  // private apiUrl = 'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  getMediaDetailsById(mediaId: number): Observable<MediaDetailsResponse> {
    return this.http
      .get<MediaDetailsResponse>(`${this.apiUrl}/api/v1/media/detail/${mediaId}`)
      .pipe(catchError((error) => this.errorHandler.handleHttpError(error)));
  }
}
