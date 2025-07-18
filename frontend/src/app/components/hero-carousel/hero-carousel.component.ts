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
        'assets/images/breaking-bad2.png', // Prison cell by Matthew Ansley
    },
    {
      title: 'The Godfather',
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      rating: 9.2,
      year: 1972,
      duration: '175m',
      genres: ['Crime', 'Drama'],
      image:'assets/images/Dune-2.png', // Man in suit by Graphe Tween
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
        'assets/images/Rectangle-4.png', // City at night by Denys Nevozhai
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
        'assets/images/bts.png', // Auschwitz by Karsten Winegeart
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
        'assets/images/final-destination.png', // Mel's Drive-in by Cesira Alvarado
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
