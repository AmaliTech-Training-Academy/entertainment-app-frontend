import { Component } from '@angular/core';
import { SidebarComponent } from '../../features/side-bar/side-bar.component';
import { AdminDashboardComponent } from "../../features/admin-dashboard/admin-dashboard.component";
import { AdminUserComponent } from '../../features/admin-user/admin-user.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
