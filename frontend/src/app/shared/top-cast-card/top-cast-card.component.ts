import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-cast-card',
  templateUrl: './top-cast-card.component.html',
  styleUrls: ['./top-cast-card.component.scss']
})
export class TopCastCardComponent {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
} 