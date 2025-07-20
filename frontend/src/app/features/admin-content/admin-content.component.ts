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
    this.setupSearchDebounce();
    this.loadMedia();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only trigger if search query actually changed
        takeUntil(this.destroy$),
      )
      .subscribe((query) => {
        this.currentPage = 0; // Reset to first page when searching
        this.loadMedia();
      });
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

  onSearchChange(): void {
    // Reset pagination when search changes
    this.currentPage = 0;

    // Trigger the debounced search
    this.searchSubject.next(this.searchQuery);
  }

  // Enhanced search method that handles empty queries better
  performSearch(): void {
    const trimmedQuery = this.searchQuery.trim();

    if (trimmedQuery.length === 0) {
      // If search is cleared, load all media
      this.clearFilters();
      return;
    }

    if (trimmedQuery.length < 2) {
      // Don't search for very short queries
      return;
    }

    this.currentPage = 0;
    this.loadMedia();
  }

  openUploadDialog(): void {
    console.log('Upload dialog triggered');
    // TODO: Implement upload functionality
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

  editMedia(item: MediaItem): void {
    console.log('Edit media:', item);
    // TODO: Open edit modal or navigate to edit page
  }

  deleteMedia(item: MediaItem): void {
    const confirmMessage = `Are you sure you want to delete "${item.title}"? This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      const mediaId = (item as any).id || (item as any).mediaId;

      if (mediaId) {
        this.adminService.deleteMedia(mediaId).subscribe({
          next: (response) => {
            console.log('Media deleted successfully:', response);
            // Refresh the current page or go to previous page if current page becomes empty
            if (this.media.length === 1 && this.currentPage > 0) {
              this.currentPage--;
            }
            this.loadMedia();
          },
          error: (err) => {
            console.error('Failed to delete media:', err);
            alert('Failed to delete media. Please try again.');
          },
        });
      } else {
        console.error('Media ID not found for deletion');
        alert('Unable to delete media: ID not found');
      }
    }
  }

  refreshData(): void {
    this.loadMedia();
  }

  // Method to check if we have results
  hasResults(): boolean {
    return this.media.length > 0;
  }

  // Method to get appropriate empty state message
  getEmptyStateMessage(): string {
    if (this.isLoading) {
      return 'Loading...';
    }

    if (this.isSearching) {
      return `No movies found for "${this.searchQuery}". Try adjusting your search.`;
    }

    return 'No movies available.';
  }
}
