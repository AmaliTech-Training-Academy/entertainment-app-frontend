import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-trending-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './trending-movie-card.component.html',
  styleUrls: ['./trending-movie-card.component.scss'],
})
export class TrendingMovieCardComponent {
  @Input() rank!: number;
  @Input() image!: string;
  @Input() alt!: string;
  @Input() mediaId!: number;

  router = inject(Router);

  navigateToMovie() {
    this.router.navigate([`media/detail/${this.mediaId}`]);
  }
}
