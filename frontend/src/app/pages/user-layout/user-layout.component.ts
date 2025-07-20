import { Component, inject } from '@angular/core';
import { UserSidebarComponent } from '../../features/user-sidebar/user-sidebar.component';
import { Router, RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-user-layout',
  imports: [
    UserSidebarComponent,
    RouterOutlet,
    ConfirmModalComponent,
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
})
export class UserLayoutComponent {
  showLogoutModal = false;

  router = inject(Router);

  onLogoutClick() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.router.navigate(['/']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
