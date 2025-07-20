import { Component, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss'],
})
export class MediaPlayerComponent implements OnChanges {
  @Input() videoUrl: string | null = null;
  @ViewChild('mediaElement') mediaElement!: ElementRef<HTMLVideoElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  playbackRate = 1;
  isFullscreen = false;
  videoError = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && this.videoUrl && this.mediaElement) {
      this.mediaElement.nativeElement.src = this.videoUrl;
      this.mediaElement.nativeElement.load();
    }
  }

  ngAfterViewInit() {
    const video = this.mediaElement.nativeElement;

    video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      this.videoError = 'Failed to load video';
    });

    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
      this.duration = video.duration;
    });
  }

  togglePlay() {
    const el = this.mediaElement.nativeElement;
    if (el.paused) {
      el.play()
        .then(() => {
          this.isPlaying = true;
          console.log('Video started playing');
        })
        .catch((err) => {
          console.error('Failed to play video:', err);
        });
    } else {
      el.pause();
      this.isPlaying = false;
    }
  }

  onTimeUpdate() {
    this.currentTime = this.mediaElement.nativeElement.currentTime;
  }

  onLoadedMetadata() {
    this.duration = this.mediaElement.nativeElement.duration;
    console.log('Video metadata loaded, duration:', this.duration);
  }

  seek(event: any) {
    this.mediaElement.nativeElement.currentTime = event.target.value;
  }

  changeVolume(event: any) {
    this.volume = event.target.value;
    this.mediaElement.nativeElement.volume = this.volume;
  }

  changePlaybackRate(event: any) {
    this.playbackRate = event.target.value;
    this.mediaElement.nativeElement.playbackRate = this.playbackRate;
  }

  toggleFullscreen() {
    const el = this.mediaElement.nativeElement;
    if (!this.isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.isFullscreen = false;
    }
  }
}
