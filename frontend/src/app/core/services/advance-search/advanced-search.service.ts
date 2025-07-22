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

interface TitleSearchResponse {
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
  type?: 'All' | 'Movie' | 'TV_SHOW';
}

@Injectable({
  providedIn: 'root',
})
export class AdvancedSearchService {
  private readonly apiUrl = environment.apiBaseUrl;
  private listingsUrl = `${this.apiUrl}/api/v1/media/listings`;

  private readonly TRENDING_URL = `${this.apiUrl}/api/v1/media/trending-now`;
  private readonly SEARCH_URL = `${this.apiUrl}/api/v1/media/advanced-search`;
  private readonly TITLE_SEARCH_URL = `${this.apiUrl}/api/v1/media/search`;

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http
      .get<any>(this.listingsUrl)
      .pipe(map((response) => response.data.content as Movie[]));
  }

  searchMovies(filters: MovieFilters): Observable<MoviesApiResponse> {
    const { url, params } = this.determineRequestConfig(filters);

    console.log('Making request to:', url);
    console.log('With params:', params.toString());

    return this.http
      .get<TitleSearchResponse | AdvancedSearchResponse | TrendingResponse>(url, { params })
      .pipe(
        tap((response) => console.log('Raw API response:', response)),
        map((response) => this.normalizeResponse(response, filters, url)),
        catchError((error) => {
          console.error('API Error:', error);
          return of(this.getEmptyResponse());
        }),
      );
  }

  private determineRequestConfig(filters: MovieFilters): { url: string; params: HttpParams } {
    let params = new HttpParams();
    let url: string;

    // Case 1: Title search (only title parameter, no pagination)
    if (filters.query) {
      url = this.TITLE_SEARCH_URL;
      params = params.set('title', filters.query);
      return { url, params };
    }

    // Case 2: Filter search (all other filters)
    if (this.hasActiveFilters(filters)) {
      url = this.SEARCH_URL;
      params = this.buildFilterParams(params, filters);
      return { url, params };
    }

    // Case 3: Initial load (trending with pagination)
    url = this.TRENDING_URL;
    params = params.set('page', (filters.page || 0).toString());
    params = params.set('size', (filters.itemsPerPage || 10).toString());
    return { url, params };
  }

  private buildFilterParams(params: HttpParams, filters: MovieFilters): HttpParams {
    // Pagination parameters
    params = params.set('page', (filters.page || 0).toString());
    params = params.set('size', (filters.itemsPerPage || 10).toString());

    // Filters
    if (filters.genre && filters.genre !== 'All') {
      params = params.set('genres', filters.genre.toUpperCase());
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
    if (filters.type && filters.type !== 'All') {
      const mediaType = filters.type === 'Movie' ? 'MOVIE' : 'TV_SHOW';
      params = params.set('mediaType', mediaType);
    }

    // Sorting
    if (filters.sort_by) {
      params = params.set('sortBy', this.mapSortBy(filters.sort_by));
      params = params.set('sortDir', filters.sort_direction || 'asc');
    }

    return params;
  }

  private normalizeResponse(
    response: TitleSearchResponse | AdvancedSearchResponse | TrendingResponse,
    filters: MovieFilters,
    url: string,
  ): MoviesApiResponse {
    // Title search response
    if (url === this.TITLE_SEARCH_URL) {
      const titleResponse = response as TitleSearchResponse;
      return {
        results: titleResponse.data || [],
        page: 1,
        total_pages: 1,
        total_results: titleResponse.data?.length || 0,
      };
    }

    // Advanced search response
    if (url === this.SEARCH_URL) {
      const advancedResponse = response as AdvancedSearchResponse;
      const content = advancedResponse.data?.content || [];
      return {
        results: content,
        page: (advancedResponse.data?.pageable?.pageNumber ?? 0) + 1,
        total_pages: advancedResponse.data?.totalPages ?? 1,
        total_results: advancedResponse.data?.totalElements ?? 0,
      };
    }

    // Trending response (client-side pagination)
    const trendingResponse = response as TrendingResponse;
    const itemsPerPage = filters.itemsPerPage || 10;
    const currentPage = filters.page ?? 0;
    const startIndex = currentPage * itemsPerPage;
    const allResults = trendingResponse.data || [];

    return {
      results: allResults.slice(startIndex, startIndex + itemsPerPage),
      page: currentPage + 1,
      total_pages: Math.ceil(allResults.length / itemsPerPage),
      total_results: allResults.length,
    };
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
