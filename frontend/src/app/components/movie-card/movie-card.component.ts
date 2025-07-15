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
  @Input() title = 'The Great Lands';
  @Input() year = '2019';
  @Input() type: 'Movie' | 'Series' | 'Both' = 'Movie';
  @Input() rating = 9;
  @Input() genres: string[] = ['Action', 'Adventure', 'Thriller'];
  @Input() imageUrl = 'movie.png';
  @Input() isBookmarked = false;

  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? 'movie' : 'tv';
  }
}
