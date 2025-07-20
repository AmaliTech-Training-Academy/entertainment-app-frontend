import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingMovieCardComponent } from '../trending-movie-card/trending-movie-card.component';
import { TrendingMovie } from '../../core/services/home-content/movies.service';

@Component({
  selector: 'app-trending-carousel',
  standalone: true,
  imports: [CommonModule, TrendingMovieCardComponent],
  templateUrl: './trending-carousel.component.html',
  styleUrl: './trending-carousel.component.scss',
})
export class TrendingCarouselComponent {
  @Input() movies: TrendingMovie[] = [];

  currentTrendingStartIndex = 0;
  trendingSlideDirection: 'slide-left' | 'slide-right' | '' = '';

  get visibleTrendingMovies() {
    return this.movies.slice(this.currentTrendingStartIndex, this.currentTrendingStartIndex + 4);
  }

  nextTrending() {
    if (this.currentTrendingStartIndex < this.movies.length - 4) {
      this.trendingSlideDirection = 'slide-left';
      setTimeout(() => {
        this.currentTrendingStartIndex++;
        this.trendingSlideDirection = '';
      }, 400);
    }
  }

  prevTrending() {
    if (this.currentTrendingStartIndex > 0) {
      this.trendingSlideDirection = 'slide-right';
      setTimeout(() => {
        this.currentTrendingStartIndex--;
        this.trendingSlideDirection = '';
      }, 400);
    }
  }
}
