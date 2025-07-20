import { Component, ElementRef, HostListener } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
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
  imports: [CommonModule, ButtonComponent, AvatarComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  searchQuery = '';
  showDropdown = false;
  searchResults: SearchMovie[] = [
    {
      rank: 1,
      image: 'https://images.unsplash.com/photo-1752350434950-50e8df9c268e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Beyond Earth',
      year: 1995,
    },
    {
      rank: 2,
      image: 'https://images.unsplash.com/photo-1752350434950-50e8df9c268e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Beyond Earth',
      year: 1995,
    },
    {
      rank: 3,
      image: 'https://images.unsplash.com/photo-1752350434950-50e8df9c268e?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Beyond Earth',
      year: 1995,
    },
  ];
  isAuthenticated = false;
  user: { email: string; name: string; avatar: string; roles?: string[] } | null = null;
  showUserDropdown = false;
  public cookies: any = {};

  constructor(
    private router: Router,
    private eRef: ElementRef,
  ) {}

  ngOnInit() {
    this.checkAuth();
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
    // TODO: Implement real search logic here
    this.showDropdown = !!value;
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

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
      this.showUserDropdown = false;
    }
  }
}
