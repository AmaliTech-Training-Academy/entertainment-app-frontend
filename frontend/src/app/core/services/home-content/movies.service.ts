import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrendingMovie {
  mediaId: number;
  mediaType: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  genres: string[];
  averageRating: number;
}

export interface TrendingMoviesResponse {
  data: TrendingMovie[];
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingMoviesService {
  private readonly apiUrl =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1/media/trending-now';

  private http = inject(HttpClient);

  getTrendingMovies(): Observable<TrendingMoviesResponse> {
    return this.http.get<TrendingMoviesResponse>(this.apiUrl);
  }
}
