import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingMovieCardComponent } from '../components/trending-movie-card/trending-movie-card.component';
import { MovieFavoriteCardComponent } from '../components/movie-card/movie-favorite-card.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, TrendingMovieCardComponent, MovieFavoriteCardComponent],
  templateUrl: './user-dashboard.page.component.html',
  styleUrls: ['./user-dashboard.page.component.scss']
})
export class UserDashboardPageComponent {
  user = {
    name: 'John',
    moviesWatched: 127,
    watchTime: 248,
    avgRating: 4.2,
    favorites: 45
  };

  continueWatching = [
    {
      title: 'The Dark Knight',
      year: 2008,
      genre: 'Action',
      duration: '2h 32m',
      watched: 75,
      rating: 9.0,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    },
    {
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      duration: '2h 28m',
      watched: 45,
      rating: 8.8,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    },
    {
      title: 'Interstellar',
      year: 2014,
      genre: 'Sci-Fi',
      duration: '2h 49m',
      watched: 20,
      rating: 8.6,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    },
    {
      title: 'Interstellar',
      year: 2014,
      genre: 'Sci-Fi',
      duration: '2h 49m',
      watched: 20,
      rating: 8.6,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    },
  ];

  favorites = [
    // {
    //   title: 'The Great Lands',
    //   year: '2019',
    //   type: 'Movie',
    //   rating: '9/10',
    //   genres: ['Action', 'Adventure', 'Thriller'],
    //   imageUrl: 'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    //   isBookmarked: true,
    // },
    {
      title: 'Inception',
      year: '2010',
      type: 'Movie',
      rating: '8.8/10',
      genres: ['Sci-Fi', 'Thriller'],
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      isBookmarked: true,
    },
    {
      title: 'Interstellar',
      year: '2014',
      type: 'Movie',
      rating: '8.6/10',
      genres: ['Sci-Fi', 'Drama'],
      imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      isBookmarked: true,
    },
    {
      title: 'The Dark Knight',
      year: '2008',
      type: 'Movie',
      rating: '9.0/10',
      genres: ['Action', 'Crime'],
      imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      isBookmarked: true,
    },
  ];

  trendingMovies = this.continueWatching;
  currentTrendingStartIndex = 0;
  trendingSlideDirection: 'slide-left' | 'slide-right' | '' = '';

  get visibleTrendingMovies() {
    const n = this.trendingMovies.length;
    if (n === 0) return [];
    return Array.from({ length: Math.min(4, n) }, (_, i) =>
      this.trendingMovies[(this.currentTrendingStartIndex + i) % n]
    );
  }

  nextTrending() {
    const n = this.trendingMovies.length;
    if (n === 0) return;
    this.trendingSlideDirection = 'slide-left';
    setTimeout(() => {
      this.currentTrendingStartIndex = (this.currentTrendingStartIndex + 1) % n;
      this.trendingSlideDirection = '';
    }, 400);
  }

  prevTrending() {
    const n = this.trendingMovies.length;
    if (n === 0) return;
    this.trendingSlideDirection = 'slide-right';
    setTimeout(() => {
      this.currentTrendingStartIndex = (this.currentTrendingStartIndex - 1 + n) % n;
      this.trendingSlideDirection = '';
    }, 400);
  }
} 