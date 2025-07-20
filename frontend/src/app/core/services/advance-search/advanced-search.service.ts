import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, filter, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Movie {
  mediaId: number;
  mediaType: 'MOVIE' | 'TV_SHOW';
  title: string;
  releaseYear: number | null;
  thumbnailUrl: string;
  genres: string[];
  averageRating: number;
}

interface AdvancedSearchResponse {
  data: {
    content?: Movie[];
    pageable?: {
      pageNumber?: number;
      pageSize?: number;
    };
    totalElements?: number;
    totalPages?: number;
    last?: boolean;
    first?: boolean;
    empty?: boolean;
  } | null;
  status: number;
  success: boolean;
}

interface TrendingResponse {
  data: Movie[] | null;
  status: number;
  success: boolean;
}

export interface MoviesApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface MovieFilters {
  query?: string;
  genre?: string;
  year?: string;
  language?: string;
  page?: number;
  itemsPerPage?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  rating?: string;
  type?: 'All' | 'MOVIE' | 'TV_SHOW';
}

@Injectable({
  providedIn: 'root',
})
export class AdvancedSearchService {
  private readonly TRENDING_URL = `${environment.apiBaseUrl}/trending-now`;
  private readonly SEARCH_URL = `${environment.apiBaseUrl}/advanced-search`;
  constructor(private http: HttpClient) {}

  searchMovies(filters: MovieFilters): Observable<MoviesApiResponse> {
    // Determine which endpoint to use
    const useAdvancedSearch = !!filters.query || this.hasActiveFilters(filters);
    const url = useAdvancedSearch ? this.SEARCH_URL : this.TRENDING_URL;

    // Build query parameters
    let params = new HttpParams();

    // Pagination parameters
    params = params.set('page', (filters.page || 0).toString());
    params = params.set('size', (filters.itemsPerPage || 10).toString());

    // Search query
    if (filters.query) {
      params = params.set('query', filters.query);
    }

    // Filters
    if (filters.genre && filters.genre !== 'All') {
      params = params.set('genre', filters.genre.toUpperCase());
    }
    if (filters.year && filters.year !== 'All') {
      params = params.set('releaseYear', filters.year);
    }
    if (filters.language && filters.language !== 'All') {
      params = params.set('language', filters.language.toUpperCase());
    }
    if (filters.rating && filters.rating !== 'All') {
      params = params.set('rating', filters.rating);
    }
    if (filters.type && filters.type !== 'All' && filters.type !== 'MOVIE') {
      const transformedType = 'TV_SHOW';
      params = params.set('mediaType', transformedType);
    }

    if (filters.type && filters.type !== 'All' && filters.type === 'MOVIE') {
      params = params.set('mediaType', filters.type.toUpperCase());
    }

    // Sorting
    if (filters.sort_by) {
      params = params.set('sortBy', this.mapSortBy(filters.sort_by));
      params = params.set('sortDir', filters.sort_direction || 'asc');
    }

    console.log('Making request to:', url);
    console.log('With params:', params.toString());

    return this.http.get<any>(url, { params }).pipe(
      tap((response) => console.log('Raw API response:', response)),
      map((response) => this.normalizeResponse(response, filters, useAdvancedSearch)),
      catchError((error) => {
        console.error('API Error:', error);
        return of(this.getEmptyResponse());
      }),
    );
  }

  private normalizeResponse(
    response: any,
    filters: MovieFilters,
    isAdvancedSearch: boolean,
  ): MoviesApiResponse {
    if (isAdvancedSearch) {
      // Advanced search response format
      return {
        results: response.data?.content || [],
        page: (response.data?.pageable?.pageNumber ?? 0) + 1,
        total_pages: response.data?.totalPages ?? 1,
        total_results: response.data?.totalElements ?? 0,
      };
    } else {
      // Trending response format (client-side pagination)
      const itemsPerPage = filters.itemsPerPage || 10;
      const currentPage = filters.page ?? 0;
      const startIndex = currentPage * itemsPerPage;

      return {
        results: response.data?.slice(startIndex, startIndex + itemsPerPage) || [],
        page: currentPage + 1,
        total_pages: Math.ceil((response.data?.length || 0) / itemsPerPage),
        total_results: response.data?.length || 0,
      };
    }
  }

  private hasActiveFilters(filters: MovieFilters): boolean {
    return !!(
      (filters.genre && filters.genre !== 'All') ||
      (filters.year && filters.year !== 'All') ||
      (filters.language && filters.language !== 'All') ||
      (filters.rating && filters.rating !== 'All') ||
      (filters.type && filters.type !== 'All') ||
      filters.sort_by
    );
  }

  private mapSortBy(sortBy: string): string {
    const sortMap: Record<string, string> = {
      Title: 'SORT_BY_TITLE',
      Year: 'SORT_BY_YEAR',
      Type: 'SORT_BY_TYPE',
      Duration: 'SORT_BY_DURATION',
    };
    return sortMap[sortBy] || 'SORT_BY_TITLE';
  }

  private getEmptyResponse(): MoviesApiResponse {
    return {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };
  }
}
