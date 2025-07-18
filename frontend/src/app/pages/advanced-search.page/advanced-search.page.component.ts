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
  MoviesApiResponse,
} from '../../core/services/advanced-search.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  styleUrl: './advanced-search.page.component.scss',
})
export class AdvancedSearchPageComponent implements OnInit {
  @ViewChild(AdvancedSearchComponent)
  advancedSearchComponent?: AdvancedSearchComponent;
  itemsPerPage: number = 12;
  constructor(private advSearchService: AdvancedSearchService) {
    this.searchQuery == '' &&
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
  filteredMovies: any[] = [];

  ngOnInit(): void {
    this.fetchMovies({});
  }

  isLoading = false;

  fetchMovies(filters: MovieFilters) {
    this.isLoading = true;
    // setTimeout(() => {
    this.advSearchService.searchMovies(filters).subscribe({
      next: (response) => {
        this.allMovies = response.results;
        this.filteredMovies = response.results;
        this.totalPages =
          Math.ceil(response.total_results / this.itemsPerPage) || 1; // Fixed
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch movies:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    // }, 5000);
  }

  search_filter_state = false;
  searchQuery = '';
  currentPage = 1;
  totalPages = 7;

  // Mock data for movies
  allMovies: Movie[] = [];

  // Filter options
  types = ['All', 'Movie', 'Series'];
  genres = ['All', 'Action', 'Adventure', 'Thriller'];
  ratings = ['All', '9/10', '8/10', '6/10'];
  years = ['All', '2019', '2023', '2025'];
  languages = ['All', 'English', 'French', 'Spanish'];

  selectedType = 'All';
  selectedGenre = 'All';
  selectedRating = 'All';
  selectedYear = 'All';
  selectedLanguage = 'All';

  onPageChange(page: number) {
    this.currentPage = page;

    // Re-use current filter state if needed
    const filters: MovieFilters = {
      query: this.searchQuery,
      genre: this.selectedGenre !== 'All' ? this.selectedGenre : undefined,
      year: this.selectedYear !== 'All' ? this.selectedYear : undefined,
      language:
        this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined,
      sort_by: 'popularity',
      page: this.currentPage,
    };

    this.fetchMovies(filters);
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
    this.isLoading = true;
    this.search_filter_state = true;
    this.currentPage = 1;
    const filters: MovieFilters = {
      query: event.query,
      genre: event.filters.genre !== 'All' ? event.filters.genre : undefined,
      year: event.filters.year !== 'All' ? event.filters.year : undefined,
      language:
        this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined,
      sort_by: 'popularity',
      page: this.currentPage,
    };

    this.fetchMovies(filters);
  }

  resetFilters() {
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
