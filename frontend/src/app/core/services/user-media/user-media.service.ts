import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../advance-search/advanced-search.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserMediaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFavorites(userId: string): Observable<Movie[]> {
    return this.http
      .get<any>(`https://d101mapcha7bof.cloudfront.net/api/v1/users/${userId}/favorites`)
      .pipe(
        map((response) =>
          response.data && response.data.content ? (response.data.content as Movie[]) : [],
        ),
      );
  }

  getRecommendations(userId: string): Observable<Movie[]> {
    return this.http
      .get<any>(`https://d101mapcha7bof.cloudfront.net/api/v1/media/${userId}/recommendations`)
      .pipe(map((response) => (response.data ? (response.data as Movie[]) : [])));
  }
}
