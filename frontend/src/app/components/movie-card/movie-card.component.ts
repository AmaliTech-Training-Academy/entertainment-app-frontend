import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() title = 'The Great Lands';
  @Input() year = '2019';
  @Input() type: 'Movie' | 'Series' | 'Both' = 'Movie';
  @Input() rating = 9;
  @Input() genres: string[] = ['Action', 'Adventure', 'Thriller'];
  @Input() imageUrl =
    'https://storage.googleapis.com/a1aa/image/655bba0c-022f-43df-9bb2-ea4d63785c96.jpg';
  @Input() isBookmarked = false;

  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? 'movie' : 'tv';
  }
}
