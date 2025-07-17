import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../features/footer/footer.component';

@Component({
  selector: 'app-recommendation-page',
  standalone: true,
  imports: [NavbarComponent, MovieCardComponent, CommonModule, FooterComponent],
  templateUrl: './recommendation-page.component.html',
  styleUrl: './recommendation-page.component.scss'
})
export class RecommendationPageComponent {
  movies = [
    {
      title: 'The Great Lands',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
      isBookmarked: false,
    },
    {
      title: 'The Great Lands',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
      isBookmarked: false,
    },
    {
      title: 'The Great Lands',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
      isBookmarked: false,
    },
    {
      title: 'The Great Lands',
      year: '2019',
      type: 'Movie',
      rating: '9/10',
      genres: ['Action', 'Adventure', 'Thriller'],
      imageUrl:
        'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
      isBookmarked: false,
    },
  ];
}
