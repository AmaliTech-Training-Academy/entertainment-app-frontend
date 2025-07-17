import { Component } from '@angular/core';
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-recommendation-page',
  standalone: true,
  imports: [ MovieCardComponent, CommonModule ],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent {
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
