import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddMediaService {
  // private apiUrl = `${environment.apiBaseUrl}/media`;
  private apiUrl =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1/media';

  constructor(private http: HttpClient) {}

  createMedia(mediaData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, mediaData);
  }
}
