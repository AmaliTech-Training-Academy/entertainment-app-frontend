import { Component } from '@angular/core';
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

  constructor(private router: Router) {}

onLogoutClick() {
  this.showLogoutModal = true;
}

confirmLogout() {
  this.showLogoutModal = false;
  this.router.navigate(['/']); // or authService.logout() if using auth logic
}


cancelLogout() {
  this.showLogoutModal = false;
}

}
