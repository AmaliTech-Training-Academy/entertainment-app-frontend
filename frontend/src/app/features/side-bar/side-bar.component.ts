import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Home, LucideAngularModule, Settings, Users, MoveLeft } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [ LucideAngularModule, CommonModule, RouterLink ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent {

  bottomItem = { label: 'Back to Home', icon: MoveLeft };

  topItems = [
  { label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
  { label: 'Users', icon: Users, route: '/admin/users' }, 
];

}
