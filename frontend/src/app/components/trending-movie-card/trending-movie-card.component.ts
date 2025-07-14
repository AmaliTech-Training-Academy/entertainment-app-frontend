import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-trending-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './trending-movie-card.component.html',
  styleUrl: './trending-movie-card.component.scss'
})
export class TrendingMovieCardComponent {

}
