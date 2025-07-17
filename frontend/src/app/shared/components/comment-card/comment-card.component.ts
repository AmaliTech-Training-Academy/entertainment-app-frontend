import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() dateTime: string = '';
  @Input() description: string = '';
}
