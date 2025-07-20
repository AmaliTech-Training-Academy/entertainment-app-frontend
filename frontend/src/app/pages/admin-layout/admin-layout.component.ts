import { Component, HostListener } from '@angular/core';
import { SidebarComponent } from '../../features/side-bar/side-bar.component';
import { AdminDashboardComponent } from '../../features/admin-dashboard/admin-dashboard.component';
import { AdminUserComponent } from '../../features/admin-user/admin-user.component';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarComponent, RouterOutlet, ConfirmModalComponent, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  showLogoutModal = false;
  showProfileDropdown = false;

  // Mock user data - replace with actual user service
  userEmail = 'admin@cineverse.com';
  userName = 'Admin User';

  constructor(private router: Router) {}

  onLogoutClick() {
    this.showLogoutModal = true;
    this.showProfileDropdown = false;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.router.navigate(['/']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  getUserInitials(): string {
    if (!this.userName) return 'U';

    const names = this.userName.split(' ').filter((name) => name.length > 0);
    if (names.length === 0) return 'U';

    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const profileContainer = target.closest('.profile-container');

    if (!profileContainer) {
      this.closeProfileDropdown();
    }
  }
}
