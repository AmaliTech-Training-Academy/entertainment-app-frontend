import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeroCarouselComponent } from "./components/hero-carousel/hero-carousel.component";
import { TrendingMovieCardComponent } from './components/trending-movie-card/trending-movie-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeroCarouselComponent, TrendingMovieCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'entertainment-app-frontend';

  trendingMovies = [
    {
      rank: 1,
      image: 'https://upload.wikimedia.org/wikipedia/en/a/ab/Final_Destination_Bloodlines_%282025%29_poster.jpg',
      alt: 'Final Destination Bloodlines poster'
    },
    {
      rank: 2,
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Maa poster'
    },
    {
      rank: 3,
      image: 'https://images.unsplash.com/photo-1613679074451-9ddcc1103cc8?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Heads of State poster'
    },
    {
      rank: 4,
      image: 'https://images.unsplash.com/photo-1556684996-c32e7604965a?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Ballerina poster'
    }
  ];
}
