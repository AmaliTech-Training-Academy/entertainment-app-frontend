import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent {
  @Output() logoutClicked = new EventEmitter<void>();
  bottomItem = { label: 'Back to Home' };

  constructor(private router: Router) {}

  topItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Users', route: '/admin/users', icon: 'users' },
    { label: 'Media', route: '/admin/content', icon: 'film' },
    { label: 'Logout', route: '/', icon: 'logout' },
  ];

  onItemClick(item: any) {
    if (item.label === 'Logout') {
      this.logoutClicked.emit(); 
    }
   
  }
}
