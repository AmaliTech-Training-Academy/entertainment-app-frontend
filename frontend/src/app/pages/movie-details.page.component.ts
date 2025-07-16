import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Movie Details Page</h1><p>Movie ID: {{ movieId }}</p>`
})
export class MovieDetailsComponent {
  movieId = '';
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
    });
  }
} 