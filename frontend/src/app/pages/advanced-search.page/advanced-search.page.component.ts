import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { AdvancedSearchComponent } from '../../components/advanced-search/advanced-search.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import {
  AdvancedSearchService,
  Movie,
  MoviesApiResponse,
} from '../../core/services/advance-search/advanced-search.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchCacheService } from '../../core/services/advance-search/search-cache.service';

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
    AdvancedSearchComponent,
    MovieCardComponent,
    PaginationComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './advanced-search.page.component.html',
  styleUrls: ['./advanced-search.page.component.scss'],
})
export class AdvancedSearchPageComponent implements OnInit {
  @ViewChild(AdvancedSearchComponent) advancedSearchComponent!: AdvancedSearchComponent;
  filteredMovies: Movie[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  searchQuery = '';

  constructor(
    private advSearchService: AdvancedSearchService,
    private cacheService: SearchCacheService,
  ) {}

  ngOnInit(): void {
    this.fetchMovies({
      page: 0, // API uses 0-based index
      itemsPerPage: this.itemsPerPage,
    });
  }

  private fetchInitialMovies(): void {
    this.fetchMovies({
      page: 0,
      itemsPerPage: this.itemsPerPage,
    });
  }

  private generateCacheKey(filters: any): string {
    return JSON.stringify({
      query: filters.query,
      genre: filters.genre,
      year: filters.year,
      language: filters.language,
      rating: filters.rating,
      type: filters.type,
      sort_by: filters.sort_by,
      sort_direction: filters.sort_direction,
      page: filters.page,
      itemsPerPage: filters.itemsPerPage,
    });
  }

  fetchMovies(filters: any): void {
    this.isLoading = true;
    const cacheKey = this.generateCacheKey(filters);
    const cachedData = this.cacheService.get(cacheKey);


    console.log('Fetching with filters:', filters);

    if (cachedData) {
      this.handleMovieResponse(cachedData);
      return;
    }


    this.advSearchService.searchMovies(filters).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.cacheService.set(cacheKey, response);
        this.handleMovieResponse(response);
      },
      error: (err) => {
        console.error('Failed to fetch movies:', err);
        this.isLoading = false;
        this.filteredMovies = [];
      },
    });
  }

  private handleMovieResponse(response: MoviesApiResponse): void {
    this.filteredMovies = response.results;
    this.currentPage = response.page;
    this.totalPages = response.total_pages;
    this.totalItems = response.total_results;
    this.isLoading = false;

    console.log('Updated state:', {
      movies: this.filteredMovies.length,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalItems: this.totalItems,
    });
  }

  onPageChange(newPage: number): void {
    console.log('Page changed to:', newPage);
    this.currentPage = newPage;
    this.fetchMovies({
      ...this.getCurrentFilters(),
      page: newPage - 1, // Convert to 0-based index
      itemsPerPage: this.itemsPerPage,
    });

  }

  isSearchActive(): boolean {
    return this.advancedSearchComponent?.hasActiveFilters() || false;
  }

  onSearch(event: { query: string; filters: any }): void {
    this.isLoading = true;
    this.searchQuery = event.query;
    this.currentPage = 0; // Reset to first page on new search

    const filters = {
      ...event.filters,
      query: event.query,
      page: 0,
      itemsPerPage: this.itemsPerPage,
    };

    this.fetchMovies(filters);
  }

  private getCurrentFilters(): any {
    if (!this.advancedSearchComponent) {
      return {
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
      };
    }

    return {
      ...this.advancedSearchComponent.selectedFilters,
      query: this.searchQuery,
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
    };
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.advancedSearchComponent.resetFilters();
    this.fetchInitialMovies();
  }
}
