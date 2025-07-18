// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatCardModule } from '@angular/material/card';
// import { FormsModule } from '@angular/forms';
// import {
//   AdvancedSearchComponent as AdvancedSearch,
//   AdvancedSearchComponent,
// } from '../../components/advanced-search/advanced-search.component';
// import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
// import { PaginationComponent } from '../../components/pagination/pagination.component';
// import {
//   AdvancedSearchService,
//   Movie,
//   MoviesApiResponse,
// } from '../../core/services/advanced-search.service';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// export interface MovieFilters {
//   query?: string;
//   genre?: string;
//   year?: string;
//   language?: string;
//   page?: number;
//   sort_by?: 'popularity' | 'release_date' | 'vote_average';
// }

// @Component({
//   selector: 'app-advanced-search.page',
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatButtonModule,
//     MatIconModule,
//     MatInputModule,
//     MatSelectModule,
//     MatCardModule,
//     FormsModule,
//     AdvancedSearch,
//     MovieCardComponent,
//     PaginationComponent,
//     MatProgressSpinnerModule,
//   ],
//   templateUrl: './advanced-search.page.component.html',
//   styleUrl: './advanced-search.page.component.scss',
// })
// export class AdvancedSearchPageComponent implements OnInit {
//   @ViewChild(AdvancedSearchComponent)
//   advancedSearchComponent?: AdvancedSearchComponent;
//   itemsPerPage: number = 12;
//   constructor(private advSearchService: AdvancedSearchService) {
//     this.searchQuery == '' &&
//       this.onSearch({
//         query: '',
//         filters: {
//           type: 'All',
//           genre: 'All',
//           rating: 'All',
//           year: 'All',
//         },
//       });
//   }
//   filteredMovies: any[] = [];

//   ngOnInit(): void {
//     this.fetchMovies({});
//   }

//   isLoading = false;

//   fetchMovies(filters: MovieFilters) {
//     this.isLoading = true;
//     // setTimeout(() => {
//     this.advSearchService.searchMovies(filters).subscribe({
//       next: (response) => {
//         this.allMovies = response.results;
//         this.filteredMovies = response.results;
//         this.totalPages =
//           Math.ceil(response.total_results / this.itemsPerPage) || 1; // Fixed
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Failed to fetch movies:', err);
//         this.isLoading = false;
//       },
//       complete: () => {
//         this.isLoading = false;
//       },
//     });
//     // }, 5000);
//   }

//   search_filter_state = false;
//   searchQuery = '';
//   currentPage = 1;
//   totalPages = 7;

//   // Mock data for movies
//   allMovies: Movie[] = [];

//   // Filter options
//   types = ['All', 'Movie', 'Series'];
//   genres = ['All', 'Action', 'Adventure', 'Thriller'];
//   ratings = ['All', '9/10', '8/10', '6/10'];
//   years = ['All', '2019', '2023', '2025'];
//   languages = ['All', 'English', 'French', 'Spanish'];

//   selectedType = 'All';
//   selectedGenre = 'All';
//   selectedRating = 'All';
//   selectedYear = 'All';
//   selectedLanguage = 'All';

//   onPageChange(page: number) {
//     this.currentPage = page;

//     // Re-use current filter state if needed
//     const filters: MovieFilters = {
//       query: this.searchQuery,
//       genre: this.selectedGenre !== 'All' ? this.selectedGenre : undefined,
//       year: this.selectedYear !== 'All' ? this.selectedYear : undefined,
//       language:
//         this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined,
//       sort_by: 'popularity',
//       page: this.currentPage,
//     };

//     this.fetchMovies(filters);
//   }

//   isSearchActive(): boolean {
//     return (
//       this.search_filter_state ||
//       this.searchQuery !== '' ||
//       this.selectedType !== 'All' ||
//       this.selectedGenre !== 'All' ||
//       this.selectedRating !== 'All' ||
//       this.selectedYear !== 'All' ||
//       this.selectedLanguage !== 'All'
//     );
//   }

//   onSearch(event: { query: string; filters: any }) {
//     this.isLoading = true;
//     this.search_filter_state = true;
//     this.currentPage = 1;
//     const filters: MovieFilters = {
//       query: event.query,
//       genre: event.filters.genre !== 'All' ? event.filters.genre : undefined,
//       year: event.filters.year !== 'All' ? event.filters.year : undefined,
//       language:
//         this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined,
//       sort_by: 'popularity',
//       page: this.currentPage,
//     };

//     this.fetchMovies(filters);
//   }

//   resetFilters() {
//     this.filteredMovies = [...this.allMovies];
//     this.search_filter_state = false;
//     this.searchQuery = '';

//     // Reset local filter selections
//     this.selectedType = 'All';
//     this.selectedGenre = 'All';
//     this.selectedRating = 'All';
//     this.selectedYear = 'All';
//     this.selectedLanguage = 'All';

//     if (this.advancedSearchComponent) {
//       this.advancedSearchComponent.resetFilters();
//     }
//     this.fetchMovies({});
//   }
// }

import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {
  AdvancedSearchComponent as AdvancedSearch,
  AdvancedSearchComponent,
} from '../../components/advanced-search/advanced-search.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import {
  AdvancedSearchService,
  Movie,
  MoviesApiResponse,
} from '../../core/services/advanced-search.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Cache service to handle caching of API responses
@Injectable({
  providedIn: 'root',
})
export class SearchCacheService {
  private cache = new Map<
    string,
    { data: MoviesApiResponse; timestamp: number }
  >();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

  get(key: string): MoviesApiResponse | null {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    // Check if cache is expired
    if (Date.now() - cachedItem.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  set(key: string, data: MoviesApiResponse): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export interface MovieFilters {
  query?: string;
  genre?: string;
  year?: string;
  language?: string;
  page?: number;
  sort_by?: 'popularity' | 'release_date' | 'vote_average';
}

@Component({
  selector: 'app-advanced-search.page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    AdvancedSearch,
    MovieCardComponent,
    PaginationComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './advanced-search.page.component.html',
  styleUrls: ['./advanced-search.page.component.scss'],
})
export class AdvancedSearchPageComponent implements OnInit {
  @ViewChild(AdvancedSearchComponent)
  advancedSearchComponent?: AdvancedSearchComponent;

  itemsPerPage: number = 12;
  filteredMovies: Movie[] = [];
  isLoading = false;
  search_filter_state = false;
  searchQuery = '';
  currentPage = 1;
  totalPages = 7;
  allMovies: Movie[] = [];

  // Filter options
  readonly types = ['All', 'Movie', 'Series'];
  readonly genres = ['All', 'Action', 'Adventure', 'Thriller'];
  readonly ratings = ['All', '9/10', '8/10', '6/10'];
  readonly years = ['All', '2019', '2023', '2025'];
  readonly languages = ['All', 'English', 'French', 'Spanish'];

  selectedType = 'All';
  selectedGenre = 'All';
  selectedRating = 'All';
  selectedYear = 'All';
  selectedLanguage = 'All';

  constructor(
    private advSearchService: AdvancedSearchService,
    private cacheService: SearchCacheService
  ) {
    if (this.searchQuery === '') {
      this.onSearch({
        query: '',
        filters: {
          type: 'All',
          genre: 'All',
          rating: 'All',
          year: 'All',
        },
      });
    }
  }

  ngOnInit(): void {
    this.fetchMovies({});
  }

  private generateCacheKey(filters: MovieFilters): string {
    return JSON.stringify({
      query: filters.query,
      genre: filters.genre,
      year: filters.year,
      language: filters.language,
      page: filters.page,
      sort_by: filters.sort_by,
    });
  }

  fetchMovies(filters: MovieFilters): void {
    this.isLoading = true;
    const cacheKey = this.generateCacheKey(filters);
    const cachedData = this.cacheService.get(cacheKey);

    if (cachedData) {
      this.handleMovieResponse(cachedData);
      return;
    }

    this.advSearchService.searchMovies(filters).subscribe({
      next: (response) => {
        this.cacheService.set(cacheKey, response);
        this.handleMovieResponse(response);
      },
      error: (err) => {
        console.error('Failed to fetch movies:', err);
        this.isLoading = false;
      },
    });
  }

  private handleMovieResponse(response: MoviesApiResponse): void {
    this.allMovies = response.results;
    this.filteredMovies = response.results;
    this.totalPages =
      Math.ceil(response.total_results / this.itemsPerPage) || 1;
    this.isLoading = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchMovies(this.getCurrentFilters());
  }

  isSearchActive(): boolean {
    return (
      this.search_filter_state ||
      this.searchQuery !== '' ||
      this.selectedType !== 'All' ||
      this.selectedGenre !== 'All' ||
      this.selectedRating !== 'All' ||
      this.selectedYear !== 'All' ||
      this.selectedLanguage !== 'All'
    );
  }

  onSearch(event: { query: string; filters: any }): void {
    this.isLoading = true;
    this.search_filter_state = true;
    this.currentPage = 1;
    this.searchQuery = event.query;

    // Update selected filters from the event
    this.selectedType = event.filters.type;
    this.selectedGenre = event.filters.genre;
    this.selectedYear = event.filters.year;

    this.fetchMovies(this.getCurrentFilters());
  }

  private getCurrentFilters(): MovieFilters {
    return {
      query: this.searchQuery,
      genre: this.selectedGenre !== 'All' ? this.selectedGenre : undefined,
      year: this.selectedYear !== 'All' ? this.selectedYear : undefined,
      language:
        this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined,
      sort_by: 'popularity',
      page: this.currentPage,
    };
  }

  resetFilters(): void {
    this.filteredMovies = [...this.allMovies];
    this.search_filter_state = false;
    this.searchQuery = '';

    // Reset local filter selections
    this.selectedType = 'All';
    this.selectedGenre = 'All';
    this.selectedRating = 'All';
    this.selectedYear = 'All';
    this.selectedLanguage = 'All';

    if (this.advancedSearchComponent) {
      this.advancedSearchComponent.resetFilters();
    }

    this.fetchMovies({});
  }
}
