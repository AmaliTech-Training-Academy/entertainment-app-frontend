import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../advance-search/advanced-search.service';

@Injectable({ providedIn: 'root' })
export class UserMediaService {
  private apiUrl = 'https://d101mapcha7bof.cloudfront.net';
  // private apiUrl = 'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1';

  constructor(private http: HttpClient) {}

  getFavorites(userId: string): Observable<Movie[]> {
    return this.http
      .get<any>(`${this.apiUrl}/users/${userId}/favorites`)
      .pipe(
        map((response) =>
          response.data && response.data.content ? (response.data.content as Movie[]) : [],
        ),
      );
  }

  getRecommendations(userId: string): Observable<Movie[]> {
    return this.http
      .get<any>(`${this.apiUrl}/media/${userId}/recommendations`)
      .pipe(map((response) => (response.data ? (response.data as Movie[]) : [])));
  }
}
