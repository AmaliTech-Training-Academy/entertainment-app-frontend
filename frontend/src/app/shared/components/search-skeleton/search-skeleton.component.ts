import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-dropdown__movie-card skeleton">
      <div class="search-dropdown__movie-img skeleton-img"></div>
      <div class="search-dropdown__movie-info">
        <div class="search-dropdown__movie-title skeleton-text"></div>
        <div class="search-dropdown__movie-year skeleton-text short"></div>
      </div>
    </div>
  `,
  styleUrls: ['./search-skeleton.component.scss']
})
export class SearchSkeletonComponent {} 