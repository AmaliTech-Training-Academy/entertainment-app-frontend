import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [ CommonModule, RouterLink ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent {

  bottomItem = { label: 'Back to Home' };

  topItems = [
  { label: 'Dashboard', route: '/admin/dashboard', icon: 'home' },
  { label: 'Users', route: '/admin/users', icon: 'users' }
];


}
