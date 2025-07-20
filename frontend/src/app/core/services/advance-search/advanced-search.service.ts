import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Movie {
  mediaId: number;
  mediaType: string;
  title: string;
  synopsis?: string;
  url?: string;
  releaseDate?: string;
  releaseYear?: number;
  duration?: number;
  thumbnailUrl: string;
  trailer?: string;
  language?: string;
  genreNames?: string[];
  genres?: string[];
  actorNames?: string[];
  averageRating?: number;
}

interface SearchFilters {
  query?: string;
  type?: string;
  genre?: string;
  rating?: string;
  year?: string;
  language?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdvancedSearchService {
  private apiUrl = 'https://d101mapcha7bof.cloudfront.net';
  // private readonly apiUrl =
  //   'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com';
  private listingsUrl = `${this.apiUrl}/api/v1/media/listings`;
  private advancedSearchUrl = `${this.apiUrl}/api/v1/media/advanced-search`;
  private searchUrl = `${this.apiUrl}/api/v1/media/search`;

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http
      .get<any>(this.listingsUrl)
      .pipe(map((response) => response.data.content as Movie[]));
  }

  searchMoviesAdvanced(params: {
    genres?: string[];
    language?: string;
    rating?: number;
    releaseYear?: number;
    mediaType?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Observable<any> {
    // Map frontend values to backend enums
    const queryParams: any = {};
    if (params.genres) queryParams.genres = params.genres;
    if (params.language) queryParams.language = params.language;
    if (params.rating) queryParams.rating = params.rating;
    if (params.releaseYear) queryParams.releaseYear = params.releaseYear;
    if (params.mediaType) queryParams.mediaType = params.mediaType;
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortDir) queryParams.sortDir = params.sortDir;
    return this.http.get<any>(this.advancedSearchUrl, { params: queryParams });
  }

  searchByTitle(title: string): Observable<any> {
    return this.http.get<any>(this.searchUrl, { params: { title } });
  }
  getFilterOptions(): Observable<{
    types: string[];
    genres: string[];
    ratings: string[];
    years: string[];
    languages: string[];
  }> {
    return of({
      types: ['MOVIE', 'TV_SHOW'],
      genres: ['ACTION', 'COMEDY', 'DRAMA', 'ADVENTURE', 'THRILLER'],
      ratings: ['9.0', '8.5', '8.0', '7.5', '7.0', '6.5', '6.0', '5.5'],
      years: ['2024', '2023', '2022', '2021', '2020'],
      languages: ['English', 'French', 'Spanish'],
    });
  }
}
