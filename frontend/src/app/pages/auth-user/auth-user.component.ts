import { Component } from '@angular/core';
import { HeroCarouselComponent } from "../../components/hero-carousel/hero-carousel.component";
import { TrendingMovieCardComponent } from "../../components/trending-movie-card/trending-movie-card.component";
import { RecommendationComponent } from '../../components/recommendation/recommendation.component';

@Component({
  selector: 'app-auth-user',
  imports: [HeroCarouselComponent,  TrendingMovieCardComponent, RecommendationComponent],
  templateUrl: './auth-user.component.html',
  styleUrl: './auth-user.component.scss'
})
export class AuthUserComponent {

}
