import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../core/services/admin/admin.service';
import { MediaItem } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-content',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent implements OnInit, OnDestroy {
  media: MediaItem[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  searchQuery: string = '';
  isSearching = false;
  isLoading = false;
  showUploadForm = false;
  selectedMediaItem: MediaItem | null = null;

  

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMedia(): void {
    this.isLoading = true;

    // Determine if we're in search mode
    const trimmedQuery = this.searchQuery.trim();
    this.isSearching = !!trimmedQuery;

    // Choose the appropriate service call
    const serviceCall = this.isSearching
      ? this.adminService.searchMedia(trimmedQuery, this.currentPage, this.pageSize)
      : this.adminService.getPaginatedMedia(this.currentPage, this.pageSize);

    serviceCall.subscribe({
      next: (res) => {
        this.isLoading = false;

        // Handle nested data structure (res.data.content)
        if (res.data && res.data.content) {
          this.media = res.data.content;
          this.totalPages = res.data.totalPages || 0;
          this.totalElements = res.data.totalElements || res.data.total || 0;
        }
        // Handle direct response structure (res.content)
        else if (res.content) {
          this.media = res.content;
          this.totalPages = res.totalPages || 0;
          this.totalElements = res.totalElements || res.total || res.size || 0;
        }
        // Handle direct array response
        else if (Array.isArray(res)) {
          this.media = res;
          this.totalPages = 1;
          this.totalElements = res.length;
        }
        // Handle response where media is directly in res
        else {
          this.media = res.media || res.items || [];
          this.totalPages = res.totalPages || res.pages || 1;
          this.totalElements = res.totalElements || res.total || res.count || this.media.length;
        }

        console.log(
          `Loaded ${this.media.length} items (${this.isSearching ? 'search' : 'browse'} mode)`,
          {
            totalPages: this.totalPages,
            totalElements: this.totalElements,
            response: res,
          },
        );
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load media:', err);
        // Reset data on error
        this.media = [];
        this.totalPages = 0;
        this.totalElements = 0;

        // Show user-friendly error message
        if (err.status === 404 && this.isSearching) {
          console.log('No search results found');
        } else {
          console.error('Error loading media:', err.message || 'Unknown error');
        }
      },
    });
  }


  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadMedia();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.isSearching = false;
    this.loadMedia();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  trackByMediaId(index: number, item: MediaItem): any {
    // Use id if available, otherwise fall back to title+year combination
    if ((item as any).id) {
      return (item as any).id;
    }
    if ((item as any).mediaId) {
      return (item as any).mediaId;
    }
    return item.title && item.releaseYear ? `${item.title}-${item.releaseYear}` : index;
  }



  refreshData(): void {
    this.loadMedia();
  }

  // Method to check if we have results
  hasResults(): boolean {
    return this.media.length > 0;
  }
}
