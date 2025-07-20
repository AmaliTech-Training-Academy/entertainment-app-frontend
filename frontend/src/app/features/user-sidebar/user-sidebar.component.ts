import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
})
export class UserSidebarComponent {
  @Output() logoutClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  topItems = [
    { label: 'Dashboard', route: '/user/dashboard', icon: 'dashboard' },
    { label: 'Movies', route: '/user/movies', icon: 'film' },
    { label: 'TV Shows', route: '/user/tv-shows', icon: 'tv' },
    { label: 'My List', route: '/user/my-list', icon: 'heart' },
    { label: 'Profile', route: '/user/profile', icon: 'user' },
    { label: 'Logout', route: '/', icon: 'logout' },
  ];

  onItemClick(item: any) {
    if (item.label === 'Logout') {
      this.logoutClicked.emit(); // Show modal
    } else {
      this.router.navigate([item.route]);
    }
  }
}
