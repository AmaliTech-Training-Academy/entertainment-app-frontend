import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { AdvancedSearchComponent as AdvancedSearch } from '../../components/advanced-search/advanced-search.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

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
  ],
  templateUrl: './advanced-search.page.component.html',
  styleUrl: './advanced-search.page.component.scss',
})
export class AdvancedSearchPageComponent implements OnInit {
  constructor() {}
  filteredMovies: Array<{
    title: string;
    year: string;
    type: string;
    rating: string;
    genres: string[];
    imageUrl: string;
    isBookmarked: boolean;
  }> = [];

  ngOnInit(): void {
    this.filteredMovies = this.allMovies;
  }
  searchQuery = '';
  currentPage = 1;
  totalPages = 7;

  // Mock data for movies
  allMovies = [
    {
      title: 'Beyond Earth',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
    },
    {
      title: 'Beylife',
      year: '2023',
      type: 'Movie',
      rating: '6/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
    },
    {
      title: "Ann's Bey",
      year: '2025',
      type: 'Series',
      rating: '8/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
    },
    {
      title: 'Beyond Earth',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
    },
    {
      title: 'Beylife',
      year: '2023',
      type: 'Movie',
      rating: '6/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
    },
    {
      title: "Ann's Bey",
      year: '2025',
      type: 'Series',
      rating: '8/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl: '../../../assets/images/movie.png',
      isBookmarked: false,
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
    // fetch data for the new page here
  }

  onSearch(event: { query: string; filters: any }) {
    if (!this.allMovies || this.allMovies.length === 0) return;

    this.filteredMovies = this.allMovies.filter((movie) => {
      const matchesQuery =
        !event.query ||
        movie.title.toLowerCase().includes(event.query.toLowerCase()) ||
        movie.year.includes(event.query);

      const matchesType =
        event.filters.type === 'All' || movie.type === event.filters.type;
      const matchesGenre =
        event.filters.genre === 'All' ||
        movie.genres.includes(event.filters.genre);
      const matchesRating =
        event.filters.rating === 'All' || movie.rating === event.filters.rating;
      const matchesYear =
        event.filters.year === 'All' || movie.year === event.filters.year;

      return (
        matchesQuery &&
        matchesType &&
        matchesGenre &&
        matchesRating &&
        matchesYear
      );
    });
  }

  resetFilters() {
    this.filteredMovies = [...this.allMovies];
    // If you need to reset the search component's state:
    // You'll need to use @ViewChild to access the child component
    // or emit an event from the child when reset is clicked
  }
}
