import { Component, ElementRef, HostListener } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

interface SearchMovie {
  rank: number;
  image: string;
  alt: string;
  year: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  searchQuery = '';
  showDropdown = false;
  searchResults: SearchMovie[] = [
    {
      rank: 1,
      image: 'assets/images/cineverse_logo.svg',
      alt: 'Beyond Earth',
      year: 1995,
    },
    {
      rank: 2,
      image: 'assets/images/cineverse_logo.svg',
      alt: 'Beyond Earth',
      year: 1995,
    },
  ];
  isAuthenticated = false;
  user: { email: string; name: string; avatar: string } | null = null;
  showUserDropdown = false;

  constructor(
    private router: Router,
    private eRef: ElementRef,
  ) {}

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    // Parse cookies to get auth_token and auth_user
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    const token = cookies['auth_token'];
    const user = cookies['auth_user'];
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
    // TODO: Implement real search logic here
    this.showDropdown = !!value;
  }

  goToAdvancedSearch() {
    this.showDropdown = false;
    this.router.navigate(['/advanced-search']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
  goToUserDashboard() {
    this.router.navigate(['/user-test']);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
      this.showUserDropdown = false;
    }
  }
}
