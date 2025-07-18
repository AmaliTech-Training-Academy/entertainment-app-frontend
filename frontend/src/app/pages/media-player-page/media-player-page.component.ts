import { Component } from '@angular/core';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { CommentSectionComponent } from '../../components/comment-section/comment-section.component';

@Component({
  selector: 'app-media-player-page',
  standalone: true,
  imports: [MediaPlayerComponent, CommentSectionComponent],
  templateUrl: './media-player-page.component.html',
  styleUrl: './media-player-page.component.scss',
})
export class MediaPlayerPageComponent {
  // Media player now has hardcoded video URL
}
