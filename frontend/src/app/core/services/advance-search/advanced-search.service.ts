import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.dev';

export interface Movie {
  id: string;
  movie_id: number;
  original_title: string;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string; // Format: "Wed, 09/27/2023"
  vote_average: number;
  vote_count: number;
  adult: number;
  created_at: string | null;
  updated_at: string | null;
  casts: Cast[];
}

export interface Cast {
  id: string;
  movie_id: number;
  name: string;
  original_name: string;
  popularity: string | number;
  profile_path: string;
  character: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface MoviesApiResponse {
  results: Movie[];
  total_results: number;
  page: number;
  total_pages: number;
}

export interface MovieFilters {
  query?: string;
  genre?: string;
  year?: string;
  language?: string;
  page?: number;
  sort_by?: 'popularity' | 'release_date' | 'vote_average';
}

@Injectable({
  providedIn: 'root',
})
export class AdvancedSearchService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  searchMovies(filters: MovieFilters): Observable<any> {
    return this.http.get(`${this.apiUrl}/50`, { responseType: 'text' }).pipe(
      map((response: string) => {
        // Process the text response
        const movies = JSON.parse(response); // Assuming the text response is a JSON string
        // Apply filters
        let filteredMovies = [...movies];

        if (filters.query) {
          const query = filters.query.toLowerCase();
          filteredMovies = filteredMovies.filter(
            (movie) =>
              movie.original_title.toLowerCase().includes(query) ||
              movie.overview.toLowerCase().includes(query)
          );
        }

        if (filters.year) {
          filteredMovies = filteredMovies.filter(
            (movie) =>
              new Date(movie.release_date).getFullYear().toString() ===
              filters.year
          );
        }

        // Apply sorting
        if (filters.sort_by) {
          filteredMovies = this.sortMovies(filteredMovies, filters.sort_by);
        }

        // Pagination simulation
        const page = filters.page || 1;
        const pageSize = 10; // Adjust as needed
        const startIndex = (page - 1) * pageSize;
        const paginatedResults = filteredMovies.slice(
          startIndex,
          startIndex + pageSize
        );

        return {
          results: paginatedResults,
          total_results: filteredMovies.length,
          page: page,
          total_pages: Math.ceil(filteredMovies.length / pageSize),
        };
      }),
      delay(300) // Simulate network delay
    );
  }

  private sortMovies(movies: Movie[], sortBy: string): Movie[] {
    return [...movies].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'release_date':
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        case 'vote_average':
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });
  }

  getFilterOptions(): Observable<{
    genres: string[];
    years: string[];
    languages: string[];
  }> {
    // Mock implementation - replace with actual API call if available
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) =>
      (currentYear - i).toString()
    );

    return of({
      genres: ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'],
      years: years,
      languages: ['English', 'Spanish', 'French', 'German', 'Japanese'],
    }).pipe(delay(200));
  }

  getMovieDetails(movieId: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${movieId}`).pipe(
      map((movie) => ({
        ...movie,
        // Ensure poster_path has full URL if it doesn't
        poster_path: movie.poster_path.startsWith('http')
          ? movie.poster_path
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_path: movie.backdrop_path.startsWith('http')
          ? movie.backdrop_path
          : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      }))
    );
  }
}
