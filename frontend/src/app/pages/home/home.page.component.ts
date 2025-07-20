import { Component, inject, OnInit } from '@angular/core';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { CommonModule } from '@angular/common';
import { SubscriptionFormComponent } from '../../components/subscription-form/subscription-form.component';
import { AccordionComponent } from '../../features/accordion/accordion.component';
import {
  TrendingMoviesService,
  TrendingMovie,
} from '../../core/services/home-content/movies.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TrendingCarouselComponent } from '../../components/trending-carousel/trending-carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroCarouselComponent,
    SubscriptionFormComponent,
    AccordionComponent,
    TrendingCarouselComponent,
  ],
  templateUrl: './home.page.component.html',
  styleUrl: './home.page.component.scss',
})
export class HomePage implements OnInit {
  getTrendingMovies = inject(TrendingMoviesService);

  public trendingMoviesSubject = new BehaviorSubject<TrendingMovie[]>([]);
  trendingMovies$: Observable<TrendingMovie[]> = this.trendingMoviesSubject.asObservable();

  currentTrendingStartIndex = 0;
  trendingSlideDirection: 'slide-left' | 'slide-right' | '' = '';

  get visibleTrendingMovies() {
    return this.trendingMoviesSubject.value.slice(
      this.currentTrendingStartIndex,
      this.currentTrendingStartIndex + 4,
    );
  }

  nextTrending() {
    if (this.currentTrendingStartIndex < this.trendingMoviesSubject.value.length - 4) {
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

  ngOnInit() {
    // Parse cookies to get auth_user
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    if (cookies['auth_user']) {
      try {
        JSON.parse(decodeURIComponent(cookies['auth_user']));
      } catch (e) {
        console.log('Failed to parse user from cookie:', e);
      }
    } else {
      console.log('No logged in user found in cookies.');
    }

    // Fetch trending movies from the service and update the subject
    this.getTrendingMovies.getTrendingMovies().subscribe({
      next: (response) => {
        console.log('this is a res', response);
        if (response && Array.isArray(response.data)) {
          // TEMP: Override thumbnailUrl for all movies
          // const overrideUrl =
          //   'https://images.unsplash.com/photo-1752350434950-50e8df9c268e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
          const moviesWithImage = response.data.map((movie) => ({
            ...movie,
            // thumbnailUrl: overrideUrl,
          }));
          this.trendingMoviesSubject.next(moviesWithImage);
        }
      },
      error: (err) => {
        console.error('Failed to fetch trending movies:', err);
      },
    });
  }
}
