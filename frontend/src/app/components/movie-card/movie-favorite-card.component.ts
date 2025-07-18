import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-movie-favorite-card',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './movie-favorite-card.component.html',
  styleUrl: './movie-favorite-card.component.scss',
})
export class MovieFavoriteCardComponent {
  @Input() movie = {
    title: 'Inception',
    year: '2010',
    type: 'Movie',
    rating: '8.8/10',
    genres: ['Sci-Fi', 'Thriller'],
    imageUrl: '',
    isBookmarked: true,
  };

  toggleBookmark() {
    this.movie.isBookmarked = !this.movie.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? 'movie' : 'tv';
  }
}
