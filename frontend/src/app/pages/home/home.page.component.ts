import { Component, OnInit } from '@angular/core';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';
import { TrendingMovieCardComponent } from '../../components/trending-movie-card/trending-movie-card.component';
import { CommonModule } from '@angular/common';
import { SubscriptionFormComponent } from '../../components/subscription-form/subscription-form.component';
import { AccordionComponent } from '../../features/accordion/accordion.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroCarouselComponent,
    TrendingMovieCardComponent,
    SubscriptionFormComponent,
    AccordionComponent,
  ],
  templateUrl: './home.page.component.html',
  styleUrl: './home.page.component.scss',
})
export class HomePage implements OnInit {
  trendingMovies = [
    {
      rank: 1,
      image: 'assets/images/final-destination.png',
      alt: 'Final Destination Bloodlines poster',
    },
    {
      rank: 2,
      image: 'assets/images/maa.png',
      alt: 'Maa poster',
    },
    {
      rank: 3,
      image: 'assets/images/heads-of-state.png',
      alt: 'Heads of State poster',
    },
    {
      rank: 4,
      image: 'assets/images/maa.png',
      alt: 'Heads of State poster',
    },
    {
      rank: 5,
      image: 'assets/images/heads-of-state.png',
      alt: 'Heads of State poster',
    },
    {
      rank: 6,
      image: 'assets/images/maa.png',
      alt: 'Heads of State poster',
    },
    {
      rank: 7,
      image: 'assets/images/heads-of-state.png',
      alt: 'Ballerina poster',
    },
  ];

  currentTrendingStartIndex = 0;
  trendingSlideDirection: 'slide-left' | 'slide-right' | '' = '';

  get visibleTrendingMovies() {
    return this.trendingMovies.slice(
      this.currentTrendingStartIndex,
      this.currentTrendingStartIndex + 4,
    );
  }

  nextTrending() {
    if (this.currentTrendingStartIndex < this.trendingMovies.length - 4) {
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
    console.log('Cookies on home page:', document.cookie);
    // Parse cookies to get auth_user
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    if (cookies['auth_user']) {
      try {
        const user = JSON.parse(decodeURIComponent(cookies['auth_user']));
        console.log('Logged in user from cookie:', user);
      } catch (e) {
        console.log('Failed to parse user from cookie:', e);
      }
    } else {
      console.log('No logged in user found in cookies.');
    }
  }
}
