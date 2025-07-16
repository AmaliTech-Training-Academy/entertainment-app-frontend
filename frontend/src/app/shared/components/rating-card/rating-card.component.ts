import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-card',
  templateUrl: './rating-card.component.html',
  styleUrls: ['./rating-card.component.scss']
})
export class RatingCardComponent {
  @Input() reviewer: string = '';
  @Input() rating: number = 0;
  @Input() content: string = '';
  @Input() readMoreLink: string = '';
} 