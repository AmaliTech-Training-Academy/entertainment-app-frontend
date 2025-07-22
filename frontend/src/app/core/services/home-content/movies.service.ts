import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

export interface SearchMovie {
  mediaId: number;
  mediaType: string;
  title: string;
  synopsis: string;
  url: string;
  releaseDate: string;
  duration: number;
  thumbnailUrl: string;
  trailer: string;
  language: string;
  genreNames: string[];
  actorNames: string[];
}

export interface SearchMoviesResponse {
  data: SearchMovie[];
  status: number;
  success: boolean;
  error: string[];
  message: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class TrendingMoviesService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getTrendingMovies(): Observable<TrendingMoviesResponse> {
    return this.http.get<TrendingMoviesResponse>(`https://d101mapcha7bof.cloudfront.net/api/v1/media/trending-now`);
  }

  searchMovies(params: { [key: string]: any }): Observable<SearchMoviesResponse> {
    return this.http.get<SearchMoviesResponse>(`https://d101mapcha7bof.cloudfront.net/api/v1/media/search`, { params });
  }
}
