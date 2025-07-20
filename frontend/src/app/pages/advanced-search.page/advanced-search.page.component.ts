import { Component, OnInit, ViewChild } from '@angular/core';
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
} from '../../core/services/advance-search/advanced-search.service';

type DisplayMovie = {
  title: string;
  year: string;
  type: string;
  rating: string;
  genres: string[];
  imageUrl: string;
  isBookmarked: boolean;
};
function isDefaultFilters(filters: any, query: string) {
  return (
    !query &&
    (!filters.type || filters.type === 'All') &&
    (!filters.genre || filters.genre === 'All') &&
    (!filters.rating || filters.rating === 'All') &&
    (!filters.year || filters.year === 'All') &&
    (!filters.language || filters.language === 'All')
  );
}

function isOnlySearch(query: string, filters: any) {
  return (
    query &&
    (!filters.type || filters.type === 'All') &&
    (!filters.genre || filters.genre === 'All') &&
    (!filters.rating || filters.rating === 'All') &&
    (!filters.year || filters.year === 'All') &&
    (!filters.language || filters.language === 'All')
  );
}

function mapToBackendEnums(filters: any) {
  let mediaType =
    filters.type && filters.type !== 'All'
      ? filters.type === 'Movie'
        ? 'MOVIE'
        : filters.type === 'Series'
          ? 'TV_SHOW'
          : filters.type
      : undefined;
  let genres =
    filters.genre && filters.genre !== 'All'
      ? [filters.genre.toUpperCase().replace(' ', '_')]
      : undefined;
  let sortBy = 'SORT_BY_TITLE';
  let sortDir = 'asc';
  return { mediaType, genres, sortBy, sortDir };
}

@Component({
  selector: 'app-advanced-search.page',
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
  ],
  templateUrl: './advanced-search.page.component.html',
  styleUrl: './advanced-search.page.component.scss',
})
export class AdvancedSearchPageComponent implements OnInit {
  @ViewChild(AdvancedSearchComponent)
  advancedSearchComponent?: AdvancedSearchComponent;

  constructor(private advancedSearchService: AdvancedSearchService) {}

  filteredMovies: DisplayMovie[] = [];
  allMovies: DisplayMovie[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.advancedSearchService.getAllMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies.map((movie) => ({
          title: movie.title,
          year: movie.releaseYear ? movie.releaseYear.toString() : 'N/A',
          type: movie.mediaType || 'Movie',
          rating: movie.averageRating ? movie.averageRating.toString() : 'N/A',
          genres: movie.genres || [],
          imageUrl: movie.thumbnailUrl || '../../../assets/images/movie.png',
          isBookmarked: false,
        }));
        this.filteredMovies = [...this.allMovies];
        this.totalPages = 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch movies', err);
        this.loading = false;
      },
    });
  }
  search_filter_state = false;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  types = ['All', 'Movie', 'TV_Show'];
  genres = ['All', 'Action', 'Comedy', 'Drama', 'Adventure', 'Triller'];
  ratings = ['All', '9.0', '8.5', '8.0', '7.5', '7.0', '6.5', '6.0', '5.5'];
  years = ['All', '2024', '2023', '2022', '2021', '2020'];
  languages = ['All', 'English', 'French', 'Spanish'];

  selectedType = 'All';
  selectedGenre = 'All';
  selectedRating = 'All';
  selectedYear = 'All';
  selectedLanguage = 'All';

  onPageChange(page: number) {
    this.currentPage = page;
    this.onSearch({
      query: this.searchQuery,
      filters: {
        type: this.selectedType,
        genre: this.selectedGenre,
        rating: this.selectedRating,
        year: this.selectedYear,
        language: this.selectedLanguage,
      },
    });
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

  onSearch(event: { query: string; filters: any }) {
    this.search_filter_state = true;
    this.searchQuery = event.query;
    // Only search input used
    if (isOnlySearch(event.query, event.filters)) {
      this.loading = true;
      this.advancedSearchService.searchByTitle(event.query).subscribe({
        next: (response) => {
          const movies = response.data || [];
          this.filteredMovies = movies.map((movie: any) => ({
            title: movie.title,
            year: movie.releaseYear ? movie.releaseYear.toString() : 'N/A',
            type: movie.mediaType || 'Movie',
            rating: movie.averageRating ? movie.averageRating.toString() : 'N/A',
            genres: movie.genres || [],
            imageUrl: movie.thumbnailUrl || '../../../assets/images/movie.png',
            isBookmarked: false,
          }));
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch search results', err);
          this.loading = false;
        },
      });
    } else if (!isDefaultFilters(event.filters, event.query)) {
      // Any filter active
      this.loading = true;
      const enums = mapToBackendEnums(event.filters);
      const params: any = {
        ...enums,
        language: event.filters.language !== 'All' ? event.filters.language : undefined,
        rating: event.filters.rating !== 'All' ? Number(event.filters.rating) : undefined,
        releaseYear: event.filters.year !== 'All' ? Number(event.filters.year) : undefined,
        page: this.currentPage - 1,
        size: this.pageSize,
      };
      this.advancedSearchService.searchMoviesAdvanced(params).subscribe({
        next: (response) => {
          const movies = response.data?.content || [];
          this.filteredMovies = movies.map((movie: any) => ({
            title: movie.title,
            year: movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A',
            type: movie.mediaType || 'Movie',
            rating: 'N/A',
            genres: movie.genreNames || [],
            imageUrl: movie.thumbnailUrl || '../../../assets/images/movie.png',
            isBookmarked: false,
          }));
          this.totalPages = response.data?.totalPages || 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch search results', err);
          this.loading = false;
        },
      });
    } else {
      this.loading = true;
      this.advancedSearchService.getAllMovies().subscribe({
        next: (movies) => {
          this.allMovies = movies.map((movie) => ({
            title: movie.title,
            year: movie.releaseDate ? movie.releaseDate.substring(0, 4) : 'N/A',
            type: movie.mediaType || 'Movie',
            rating: 'N/A',
            genres: movie.genreNames || [],
            imageUrl: movie.thumbnailUrl || '../../../assets/images/movie.png',
            isBookmarked: false,
          }));
          this.filteredMovies = [...this.allMovies];
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch movies', err);
          this.loading = false;
        },
      });
    }
  }

  resetFilters() {
    this.filteredMovies = [...this.allMovies];
    this.search_filter_state = false;
    this.searchQuery = '';

    this.selectedType = 'All';
    this.selectedGenre = 'All';
    this.selectedRating = 'All';
    this.selectedYear = 'All';
    this.selectedLanguage = 'All';

    if (this.advancedSearchComponent) {
      this.advancedSearchComponent.resetFilters();
    }
  }
}
