import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Plus, X } from 'lucide-angular';

@Component({
  selector: 'app-accordion',
  imports: [ CommonModule, LucideAngularModule ],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  Plus = Plus;
  X = X;
  activeIndex: number | null = null;

  accordionItems = [
    {
      title: 'What is Cineverse?',
      content:
        'Cineverse is a streaming service offering a wide variety of entertainment content including movies, series, documentaries, and original productions across multiple genres. CineVerse is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single ad - all for one low monthly price.',
    },
    {
      title: 'How much does Cineverse cost?',
      content:
        'CineVerse is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single ad - all for one low monthly price.',
    },
    {
      title: 'Can I watch offline?',
      content:
        'Yes! Cineverse allows you to download your favorite content and watch it offline anytime. CineVerse is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single ad - all for one low monthly price.',
    },
  ];

  toggle(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
