import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Movie } from '../../core/services/advance-search/advanced-search.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaDetailsService } from '../../core/services/media-details/media-details.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private favoritesService: MediaDetailsService,
  ) {}

  ngOnInit(): void {}
  // @Input() movie!: Movie;
  navigateToDetails(mediaId: number) {
    if (mediaId) {
      this.router.navigate(['/media', mediaId]);
    }
  }
  @Input() movie!: any;
  protected isProcessing = false;

  toggleBookmark(): void {
    this.movie.isBookmarked = !this.movie.isBookmarked;

    if (this.isProcessing) return;

    this.isProcessing = true;
    const userId = 1; // Replace with actual user ID from auth service
    const mediaId = this.movie.mediaId;

    const action$ = this.movie.isBookmarked;
    // ? this.favoritesService.removeFromFavorites(userId, mediaId)
    this.favoritesService.addToFavorites(userId, mediaId);

    action$
      .pipe(
        tap(() => {
          this.movie.isBookmarked = !this.movie.isBookmarked;
          this.showSuccessMessage();
        }),
        catchError((error) => {
          this.showErrorMessage(error);
          return of(null);
        }),
        tap(() => (this.isProcessing = false)),
      )
      .subscribe();
  }

  private showSuccessMessage(): void {
    this.snackBar.open(
      this.movie.isBookmarked ? 'Added to favorites!' : 'Removed from favorites!',
      'Close',
      { duration: 3000 },
    );
  }

  private showErrorMessage(error: any): void {
    console.error('Favorite operation failed:', error);
    this.snackBar.open('Failed to update favorites. Please try again.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
  getTypeIcon(type: string): string {
    return type === 'MOVIE' ? 'movie' : 'live_tv';
  }

  navigateToMovie() {
    this.router.navigate([`media/detail/${this.movie.mediaId}`]);
  }
}
