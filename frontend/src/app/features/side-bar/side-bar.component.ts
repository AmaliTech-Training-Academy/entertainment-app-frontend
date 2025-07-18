import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterModule ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent {
  bottomItem = { label: 'Back to Home' };

  constructor(private router: Router) {}

  topItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'home' },
    { label: 'Users', route: '/admin/users', icon: 'users' },
    { label: 'Logout', route: '/', icon: 'logout' },
  ];


  logout() {
    // Perform logout logic here
    console.log('Logging out...');
    // Redirect to login or home
    this.router.navigate(['/']);
  }
}
