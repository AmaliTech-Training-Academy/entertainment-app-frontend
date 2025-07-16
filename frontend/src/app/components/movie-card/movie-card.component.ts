import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-movie-card',
  imports: [MatIcon, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() movie = {
    title: 'The Great Lands',
    year: '2019',
    type: 'Movie',
    rating: '9/10',
    genres: ['Action', 'Adventure', 'Thriller'],
    imageUrl:
      'https://storage.googleapis.com/a1aa/image/4bf5dd9f-a940-4b9c-516e-3a6b6ca06980.jpg',
    isBookmarked: false,
  };

  toggleBookmark() {
    this.movie.isBookmarked = !this.movie.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? 'movie' : 'tv';
  }
}
