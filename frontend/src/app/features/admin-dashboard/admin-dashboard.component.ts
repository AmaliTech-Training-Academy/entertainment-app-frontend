// pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/admin-dashboard/dashboard.service';
import { AdminMetrics } from '../../models/admin-metrics.model';
import { TrendingMedia } from '../../models/trending-media.model';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';






@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  metrics: AdminMetrics | null = null;
  trending: TrendingMedia[] = [];
  chartData: { name: string; value: number }[] = [];
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#fc4747', '#ffdb43', '#84ebb4', '#5a70a7', '#8e8e8e'],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getMetrics().subscribe((res) => {
      this.metrics = res.data;
    });

    this.dashboardService.getTrendingMedia().subscribe((res) => {
      this.trending = res.data.slice(0, 10);

      this.chartData = [...this.trending]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5)
        .map((media) => ({
          name: media.title,
          value: media.averageRating,
        }));
    });
  }
}
