import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
