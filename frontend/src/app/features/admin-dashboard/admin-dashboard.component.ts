// pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/admin-dashboard/dashboard.service';
import { AdminMetrics } from '../../models/admin-metrics.model';
import { TrendingMedia } from '../../models/trending-media.model';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, ScaleType, Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  metrics: AdminMetrics | null = null;
  trending: TrendingMedia[] = [];
  trendingChartData: { name: string; value: number }[] = [];
  genreChartData: { name: string; value: number }[] = [];

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#fc4747', '#ffdb43', '#84ebb4', '#5a70a7', '#8e8e8e'],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.loadTrendingMedia();
    this.loadTopGenres();
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe((res) => {
      this.metrics = res.data;
    });
  }

  loadTrendingMedia(): void {
    this.dashboardService.getTrendingMedia().subscribe((res) => {
      this.trending = res.data.slice(0, 10);

      this.trendingChartData = [...this.trending]
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 5)
        .map((media) => ({
          name: media.title,
          value: media.averageRating,
        }));
    });
  }

  loadTopGenres(): void {
    this.dashboardService.getMediaListings().subscribe((res) => {
      const genreCount: Record<string, number> = {};

      res.data.content.forEach((media: any) => {
        media.genres.forEach((genre: string) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });

      this.genreChartData = Object.entries(genreCount).map(([name, value]) => ({
        name,
        value,
      }));
    });
  }
}
