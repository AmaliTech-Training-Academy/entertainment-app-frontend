// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { TrendingMovieCardComponent } from '../../components/trending-movie-card/trending-movie-card.component';
// import {
//   TrendingMoviesService,
//   TrendingMovie,
// } from '../../core/services/home-content/movies.service';
// import { VgCoreModule, VgApiService } from '@videogular/ngx-videogular/core';
// import { VgControlsModule } from '@videogular/ngx-videogular/controls';
// import { CommonModule } from '@angular/common';
// import { MediaPlayerService } from '../../core/services/media-player/media-player.service';

// function getCookie(name: string): string | null {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   return match ? decodeURIComponent(match[2]) : null;
// }

// @Component({
//   selector: 'app-media-player-page',
//   standalone: true,
//   imports: [CommonModule, VgCoreModule, VgControlsModule, TrendingMovieCardComponent],
//   templateUrl: './media-player-page.component.html',
//   styleUrl: './media-player-page.component.scss',
// })
// export class MediaPlayerPageComponent implements OnInit {
//   @ViewChild('media', { static: false }) media: HTMLVideoElement;
//   trailerUrl: string | null = null;
//   contentId: number | null = null;
//   trendingMovies: TrendingMovie[] = [];
//   api: VgApiService | undefined; // Mark as optional

//   currentPage = 1;
//   moviesPerPage = 8;

//   get paginatedTrendingMovies() {
//     const start = (this.currentPage - 1) * this.moviesPerPage;
//     return this.trendingMovies.slice(start, start + this.moviesPerPage);
//   }

//   get totalPages() {
//     return Math.ceil(this.trendingMovies.length / this.moviesPerPage);
//   }

//   goToPage(page: number) {
//     this.currentPage = page;
//   }

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private trendingMoviesService: TrendingMoviesService,
//     private vgApi: VgApiService,
//   ) {}

//   onPlayerReady(api: VgApiService) {
//     this.api = api;
//     this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
//       this.api.play();
//     });
//   }

//   ngOnInit() {
//     const nav = this.router.getCurrentNavigation();
//     this.trailerUrl = nav?.extras.state?.['trailerUrl'] || getCookie('trailerUrl') || null;
//     if (this.trailerUrl) {
//       document.cookie = 'trailerUrl=; Max-Age=0; path=/;';
//     }
//     console.log('Trailer URL:', this.trailerUrl);

//     this.route.paramMap.subscribe((params) => {
//       this.contentId = Number(params.get('id'));
//       if (!this.trailerUrl && this.contentId) {
//         this.fetchTrailerUrl(this.contentId);
//       }
//     });

//     this.trendingMoviesService.getTrendingMovies().subscribe({
//       next: (res) => {
//         this.trendingMovies = res.data;
//       },
//       error: (err) => {
//         console.error('Failed to fetch trending movies:', err);
//         this.trendingMovies = [];
//       },
//     });
//   }

//   private fetchTrailerUrl(mediaId: number) {
//     this.MediaPlayerService.getTrailerUrl(mediaId).subscribe({
//       next: (res) => {
//         this.trailerUrl = res.trailerUrl || null;
//       },
//       error: (err) => {
//         console.error(`Failed to fetch trailer for mediaId ${mediaId}:`, err);
//         this.trailerUrl = null;
//       },
//     });
//   }
// }
