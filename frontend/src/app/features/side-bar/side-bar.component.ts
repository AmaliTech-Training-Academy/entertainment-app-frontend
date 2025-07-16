import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Home, LayoutDashboard, LucideAngularModule, Settings, Users } from 'lucide-angular';

@Component({
  selector: 'app-admin-sidebar',
  imports: [ LucideAngularModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SidebarComponent {
  topItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Settings', icon: Settings },
  ];

  bottomItem = { label: 'Back to Home', icon: Home };
}
