import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin/admin.service';


@Component({
  selector: 'app-dashboard-metrics',
  templateUrl: './dashboard-metrics.component.html',
  styleUrls: ['./dashboard-metrics.component.scss'],
})
export class DashboardMetricsComponent implements OnInit {
  userCount = 0;
  mediaCount = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getMetrics().subscribe((res) => {
      this.userCount = res.data.userCount;
      this.mediaCount = res.data.mediaCount;
    });
  }
}
