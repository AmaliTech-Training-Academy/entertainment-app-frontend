import { Component, ElementRef, HostListener } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { SearchSkeletonComponent } from '../../shared/components/search-skeleton/search-skeleton.component';
import { TrendingMoviesService } from '../../core/services/home-content/movies.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

interface SearchMovie {
  rank: number;
  image: string;
  alt: string;
  year: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AvatarComponent, RouterModule, SearchSkeletonComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  searchQuery = '';
  showDropdown = false;
  searchResults: any[] = [];
  loading = false;
  private searchSubject = new Subject<string>();
  isAuthenticated = false;
  user: { email: string; name: string; avatar: string; roles?: string[] } | null = null;
  showUserDropdown = false;
  public cookies: any = {};

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private moviesService: TrendingMoviesService,
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((query) => {
          if (!query) {
            this.loading = false;
            return of({ data: [] });
          }
          this.loading = true;
          return this.moviesService.searchMovies({ title: query });
        }),
      )
      .subscribe((res: any) => {
        this.searchResults = res?.data || [];
        this.loading = false;
      });
  }

  checkAuth() {
    // Parse cookies to get auth_token and auth_user
    this.cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    const token = this.cookies['auth_token'];
    const user = this.cookies['auth_user'];
    this.isAuthenticated = !!token && !!user;
    this.user = user ? JSON.parse(decodeURIComponent(user)) : null;
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout() {
    // Remove cookies by setting expiry in the past
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.isAuthenticated = false;
    this.user = null;
    this.router.navigate(['/']);
  }

  onSearchFocus() {
    this.showDropdown = true;
  }

  onSearchBlur() {
    // Delay to allow click events on dropdown
    setTimeout(() => (this.showDropdown = false), 150);
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery = value;
    this.showDropdown = !!value;
    this.searchSubject.next(value);
  }

  isAdmin(): boolean {
    return this.user?.roles?.includes('ROLE_ADMINISTRATOR') || false;
  }

  goToDashboard() {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/user/dashboard']);
    }
  }

  goToUserDashboard() {
    this.router.navigate(['/user-test']);
  }

  goToDetail(mediaId: number) {
    this.router.navigate([`/media/detail/${mediaId}`]);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
      this.showUserDropdown = false;
    }
  }
}
