import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Movie } from '../../core/services/advanced-search.service';

@Component({
  selector: 'app-movie-card',
  imports: [MatIcon, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  toggleBookmark() {
    // this.movie.isBookmarked = !this.movie.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'Movie' ? 'movie' : 'tv';
  }
}
