import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Movie {
  title: string;
  year: string;
  type: string;
  rating: string;
  genres: string[];
  imageUrl: string;
  isBookmarked: boolean;
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
  private apiUrl = `${environment.apiBaseUrl}/movies`;

  constructor(private http: HttpClient) {}

  // For real API implementation:
  searchMovies(filters: SearchFilters): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl, { params: filters as any });
  }

  // Mock implementation (temporary - remove when real API is ready)
  searchMoviesMock(filters: SearchFilters): Observable<Movie[]> {
    const mockMovies: Movie[] = [
      {
        title: 'Beyond Earth',
        year: '2019',
        type: 'Movie',
        rating: '9/10',
        genres: ['Action', 'Adventure', 'Thriller'],
        imageUrl: '../../../assets/images/movie.png',
        isBookmarked: false,
      },
      // ... include all your mock movies here
    ];

    let results = [...mockMovies];

    if (filters.query) {
      results = results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
          movie.year.includes(filters.query!),
      );
    }

    if (filters.type && filters.type !== 'All') {
      results = results.filter((movie) => movie.type === filters.type);
    }

    if (filters.genre && filters.genre !== 'All') {
      results = results.filter((movie) => movie.genres.includes(filters.genre!));
    }

    if (filters.rating && filters.rating !== 'All') {
      results = results.filter((movie) => movie.rating === filters.rating);
    }

    if (filters.year && filters.year !== 'All') {
      results = results.filter((movie) => movie.year === filters.year);
    }

    return of(results).pipe(delay(300)); // Simulate network delay
  }

  getFilterOptions(): Observable<{
    types: string[];
    genres: string[];
    ratings: string[];
    years: string[];
    languages: string[];
  }> {
    return this.http.get(`${this.apiUrl}/9`) as Observable<{
      types: string[];
      genres: string[];
      ratings: string[];
      years: string[];
      languages: string[];
    }>;

    // Mock response:
    return of({
      types: ['Movie', 'Series'],
      genres: ['Action', 'Adventure', 'Thriller', 'Drama', 'Comedy'],
      ratings: ['9/10', '8/10', '6/10'],
      years: ['2019', '2023', '2025'],
      languages: ['English', 'French', 'Spanish'],
    });
  }
}
