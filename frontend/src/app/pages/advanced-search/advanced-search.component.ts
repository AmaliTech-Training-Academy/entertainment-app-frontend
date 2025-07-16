import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { AdvancedSearchComponent as AdvancedSearch } from '../../components/advanced-search/advanced-search.component';

@Component({
  selector: 'app-advanced-search',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    FormsModule,
    AdvancedSearch,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
})
export class AdvancedSearchComponent {
  constructor() {}

  searchQuery = '';
  currentPage = 1;
  totalPages = 7;

  // Mock data for movies
  trendingMovies = [
    {
      title: 'Beyond Earth',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
    {
      title: 'Beylife',
      year: '2023',
      type: 'Movie',
      rating: '6/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
    {
      title: "Ann's Bey",
      year: '2025',
      type: 'Series',
      rating: '8/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
    {
      title: 'Beyond Earth',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
    {
      title: 'Beylife',
      year: '2023',
      type: 'Movie',
      rating: '6/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
    {
      title: "Ann's Bey",
      year: '2025',
      type: 'Series',
      rating: '8/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    },
  ];

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
    // In a real app, you would fetch data for the new page here
  }

  search() {
    // In a real app, you would perform the search here
    console.log('Searching for:', this.searchQuery);
  }
}
