import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-hero-carousel',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.scss',
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  heroItems = [
    {
      title: 'The Shawshank Redemption',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      rating: 9.3,
      year: 1994,
      duration: '142m',
      genres: ['Drama'],
      image:
        'https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Prison cell by Matthew Ansley
    },
    {
      title: 'The Godfather',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      rating: 9.2,
      year: 1972,
      duration: '175m',
      genres: ['Crime', 'Drama'],
      image:
        'https://plus.unsplash.com/premium_photo-1710522706751-c2f0c76cc5fd?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Man in suit by Graphe Tween
    },
    {
      title: 'The Dark Knight',
      description:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      rating: 9.0,
      year: 2008,
      duration: '152m',
      genres: ['Action', 'Crime', 'Drama'],
      image:
        'https://images.unsplash.com/photo-1612635466104-e3aab50680b6?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // City at night by Denys Nevozhai
    },
    {
      title: "Schindler's List",
      description:
        'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
      rating: 9.0,
      year: 1993,
      duration: '195m',
      genres: ['Biography', 'Drama', 'History'],
      image:
        'https://images.unsplash.com/photo-1585951237313-1979e4df7385?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Auschwitz by Karsten Winegeart
    },
    {
      title: 'Pulp Fiction',
      description:
        "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      rating: 8.9,
      year: 1994,
      duration: '154m',
      genres: ['Crime', 'Drama'],
      image:
        'https://images.unsplash.com/photo-1511875762315-c773eb98eec0?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mel's Drive-in by Cesira Alvarado
    },
  ];
  currentIndex = 0;
  animate = true;
  private intervalId: any;

  get currentHero() {
    return this.heroItems[this.currentIndex];
  }

  triggerAnimation() {
    this.animate = false;
    setTimeout(() => (this.animate = true), 10);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.heroItems.length;
    this.triggerAnimation();
  }

  // prevSlide() {
  //   this.currentIndex = (this.currentIndex - 1 + this.heroItems.length) % this.heroItems.length;
  //   this.triggerAnimation();
  // }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.triggerAnimation();
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
