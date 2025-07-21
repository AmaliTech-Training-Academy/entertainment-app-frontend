import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Movie } from '../../core/services/advance-search/advanced-search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {

  constructor(private router: Router) {}
  // @Input() movie!: Movie;
   navigateToDetails(mediaId: number) {
    if (mediaId) {
      this.router.navigate(['/media', mediaId]);
    }
  }
  @Input() movie!: any;

  toggleBookmark() {
    this.movie.isBookmarked = !this.movie.isBookmarked;
  }

  getTypeIcon(type: string): string {
    return type === 'MOVIE' ? 'movie' : 'live_tv';
  }

  navigateToMovie() {
    this.router.navigate([`media/detail/${this.movie.id}`]);
  }
}
