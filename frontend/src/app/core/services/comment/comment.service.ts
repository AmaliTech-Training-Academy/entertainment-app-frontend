import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comment, CommentPost } from '../../../shared/components/comments';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

interface CommentApiResponse {
  data: Comment[];
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  // private apiUrl = 'https://d101mapcha7bof.cloudfront.net';
  private readonly apiUrl = 'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService,
  ) {}

  postComment(mediaId: number, comment: CommentPost): Observable<CommentApiResponse> {
    return this.http.post<CommentApiResponse>(
      `${this.apiUrl}/api/v1/comments/media/${mediaId}`,
      comment
    ).pipe(
      catchError((error) => this.errorHandler.handleHttpError(error))
    );
  }
}
