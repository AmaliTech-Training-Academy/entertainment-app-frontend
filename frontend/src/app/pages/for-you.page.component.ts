import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingMovieCardComponent } from '../components/trending-movie-card/trending-movie-card.component';
import {
  AdvancedSearchService,
  Movie,
} from '../core/services/advance-search/advanced-search.service';
import { UserMediaService } from '../core/services/user-media/user-media.service';

@Component({
  selector: 'app-for-you',
  standalone: true,
  imports: [CommonModule, TrendingMovieCardComponent],
  templateUrl: './for-you.page.component.html',
  styleUrl: './for-you.page.component.scss',
})
export class ForYouComponent implements OnInit {
  trendingMovies: Movie[] = [];
  favoriteMovies: Movie[] = [];
  recommendedMovies: Movie[] = [];
  trendingLoading = false;
  favoritesLoading = false;
  recommendationsLoading = false;

  constructor(
    private advancedSearchService: AdvancedSearchService,
    private userMediaService: UserMediaService,
  ) {}

  ngOnInit() {
    const userId = this.getUserIdFromCookies();
    this.fetchTrendingMovies();
    this.fetchFavoriteMovies(userId);
    this.fetchRecommendedMovies(userId);
  }

  getUserIdFromCookies(): string | null {
    // Parse cookies
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});

    const userStr = cookies['auth_user'];
    if (userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        return user.userId || user.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  fetchTrendingMovies() {
    this.trendingLoading = true;
    this.advancedSearchService.getAllMovies().subscribe({
      next: (movies: Movie[]) => {
        this.trendingMovies = movies;
        this.trendingLoading = false;
      },
      error: () => {
        this.trendingLoading = false;
      },
    });
  }

  fetchFavoriteMovies(userId: string | null) {
    console.log('User ID:', userId);
    if (!userId) return;
    this.favoritesLoading = true;
    this.userMediaService.getFavorites(userId).subscribe({
      next: (movies: Movie[]) => {
        console.log('Favorite movies:', movies);
        this.favoriteMovies = movies;
        this.favoritesLoading = false;
      },
      error: (err) => {
        console.log('Error fetching favorites', err);
        this.favoritesLoading = false;
      },
    });
  }

  fetchRecommendedMovies(userId: string | null) {
    if (!userId) return;
    this.recommendationsLoading = true;
    this.userMediaService.getRecommendations(userId).subscribe({
      next: (movies: Movie[]) => {
        this.recommendedMovies = movies;
        this.recommendationsLoading = false;
      },
      error: () => {
        this.recommendationsLoading = false;
      },
    });
  }
}
