import { Component } from '@angular/core';
import { HeroCarouselComponent } from '../../components/hero-carousel/hero-carousel.component';

@Component({
  selector: 'app-home-page',
  imports:[HeroCarouselComponent],
  standalone: true,
  template: `<app-hero-carousel/>`
})
export class HomePage {} 