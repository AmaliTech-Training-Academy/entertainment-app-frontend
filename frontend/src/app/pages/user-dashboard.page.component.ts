import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.page.component.html',
  styleUrl: './user-dashboard.page.component.scss'
})
export class UserDashboardPageComponent {
  user = {
    name: 'John',
    moviesWatched: 127,
    watchTime: 248,
    avgRating: 4.2,
    favorites: 45
  };

  continueWatching = [
    {
      title: 'The Dark Knight',
      year: 2008,
      genre: 'Action',
      duration: '2h 32m',
      watched: 75,
      rating: 9.0,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    },
    {
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      duration: '2h 28m',
      watched: 45,
      rating: 8.8,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    },
    {
      title: 'Interstellar',
      year: 2014,
      genre: 'Sci-Fi',
      duration: '2h 49m',
      watched: 20,
      rating: 8.6,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    },
  ];
} 