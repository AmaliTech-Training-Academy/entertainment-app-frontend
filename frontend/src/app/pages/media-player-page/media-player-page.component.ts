import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { CommentSectionComponent } from '../../components/comment-section/comment-section.component';
import { MediaPlayerService } from '../../core/services/media-player/media-player.service';

@Component({
  selector: 'app-media-player-page',
  standalone: true,
  imports: [MediaPlayerComponent, CommentSectionComponent],
  templateUrl: './media-player-page.component.html',
  styleUrl: './media-player-page.component.scss'
})
export class MediaPlayerPageComponent implements OnInit {
  trailerUrl: string | null = null;
  contentId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private mediaPlayerService: MediaPlayerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.contentId = Number(params.get('id'));
      if (this.contentId) {
        this.mediaPlayerService.getTrailerUrl(this.contentId).subscribe({
          next: (url) => {
            this.trailerUrl = url;
            console.log('Trailer URL fetched:', url);
          },
          error: (error) => {
            console.error('Failed to fetch trailer URL:', error);
            // You could set a fallback video URL here
            this.trailerUrl = '/assets/videos/sample-video.mp4';
          }
        });
      }
    });
  }
} 